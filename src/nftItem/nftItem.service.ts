import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NFTItems } from '../@schemas/index';
import { Model } from 'mongoose';
import { INFTItem } from './interfaces/nftItem.interface';
import { CreateNFTItemDto } from './dtos/nftItem-create.dto';
import { AxiosService } from '../@core/services/axios.services';
import { HexUtility } from './hex-utility';
var moment = require('moment');
const Web3 = require("web3");
const compiledContractABI = require("../../Hex.abi");

@Injectable()
export class NFTItemService {
  private readonly CONTRACTID: string = process.env.CONTRACT;
  private stakedMetaURL: string = process.env.STAKEDMETA_URL
  private raribleNFTURL: string = process.env.RARIBLENFT_URL;
  private hexAddr: string = process.env.HEX_ADDRESS;
  public web3 = new Web3(process.env.MAINNET_URL);

  public hex = new this.web3.eth.Contract(compiledContractABI, this.hexAddr);

  constructor(
    @InjectModel(NFTItems.name) private readonly nftItemModel: Model<INFTItem>,
    private axiosService: AxiosService,
    private hexUtility: HexUtility,
  ) { }

  public async create(nftItem: CreateNFTItemDto): Promise<INFTItem> {
    if (!await this.findOneByTokenId(nftItem.tokenId)) {
      return await this.nftItemModel.create(nftItem);
    }
  }

  public async findOneByTokenId(tokenId: string) {
    let query = this.nftItemModel.findOne({ tokenId });
    return await query.lean().exec();
  }

  public async findByWhere(where: object) {
    let query = this.nftItemModel.find(where);
    return await query.lean().exec();
  }

  public async findOneByWhere(where: object) {
    let query = this.nftItemModel.findOne(where);
    return await query.lean().exec();
  }

  public async findByIdAndUpdate(id: string, data: object) {
    let query = this.nftItemModel.findByIdAndUpdate(id, data, { new: true });
    return await query.lean().exec();
  }

  public async delistNFT(id: string, data: object) {
    if (null == await this.findOneByWhere({ _id: id, status: "LISTED" })) {
      throw new Error('Invalid NFT ID');
    }
    let query = this.nftItemModel.findByIdAndUpdate(id, data, { new: true });
    return await query.lean().exec();
  }

  public async listNft(id: string, data: object) {
    if (null == await this.findOneByWhere({ _id: id })) {
      throw new Error('Invalid NFT ID');
    }
    let query = this.nftItemModel.findByIdAndUpdate(id, data, { new: true });
    return await query.lean().exec();
  }

  public async findByIdAndDelete(id: string) {
    if (null == await this.findOneByWhere({ _id: id, status: "LISTED" })) {
      throw new Error('Invalid NFT ID');
    }
    let query = this.nftItemModel.findByIdAndDelete(id);
    return await query.lean().exec() ? true : false;
  }

  public async searchKey(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].key === nameKey) {
        return myArray[i];
      }
    }
  }

  public async syncStakedMetaCronJob() {
    var nftItems = await this.findByWhere({})
    for (let i = 0; i < nftItems.length; i++) {
      await this.syncDataHedronUpdateStkedMeta(nftItems[i])
    }
  }

  public async syncStakedMetaAddNft(nftIds: any) {
    for (let i = 0; i < nftIds.length; i++) {
      var nftItem = await this.findOneByWhere({ _id: nftIds[i]._id })
      await this.syncDataHedronUpdateStkedMeta(nftItem)
    }
  }

  public async syncDataHedronUpdateStkedMeta(nftItem: any) {
    var url = this.stakedMetaURL + nftItem.tokenId;
    var d = await this.axiosService.get(url);
    if (!d.error && d.attributes && d.attributes.length >= 1) {
      var start = moment();
      var temp = {
        "tShare": (await this.searchKey("T-Shares", d.attributes)).value,
        "principal": (await this.searchKey("HEX Staked", d.attributes)).value,
        "daysServed": d.name.split(" ")[6],
        "daysStaked": (await this.searchKey("Days Staked", d.attributes)).value,
        "hexInterest": 0
      }
      var end = moment().add(temp.daysStaked, 'days');
      var years = end.diff(start, 'year');
      start.add(years, 'years');
      var months = end.diff(start, 'months');
      start.add(months, 'months');
      var days = end.diff(start, 'days');
      temp.hexInterest = await this.hexUtility.getInterest(this.hex, temp.daysServed, temp.tShare);

      await this.findByIdAndUpdate(
        nftItem._id,
        {
          title: d.name ? d.name : "",
          image: d.image ? d.image : "",
          animation_url: d.animation_url ? d.animation_url : "",
          "meta.discription": d.description ? d.description : "",
          stakedMeta: {
            "tShare": temp.tShare,
            "startDate": moment.unix((await this.searchKey("Stake Start", d.attributes)).value).format("MMM DD,YYYY"),
            "endDate": moment.unix((await this.searchKey("Stake Start", d.attributes)).value).add((await this.searchKey("Days Staked", d.attributes)).value, 'days').format("MMM DD,YYYY"),
            "principal": temp.principal,
            "stakeEndYears": years + ' Years ' + months + ' Months ' + days + ' Days',
            "stakeCompleted": ((temp.daysServed / temp.daysStaked) * 100).toFixed(2),
            "HDRNLaunchBonus": (await this.searchKey('HDRN Launch Bonus', d.attributes)).value,
            "daysServed": temp.daysServed,
            "daysStaked": temp.daysStaked,
            "HDRNMintable": (await this.searchKey("HDRN Mintable", d.attributes)).value,
            "hexInterest": temp.hexInterest,
            "emergencyHexStakeAmount": await this.hexUtility.getEmergencyHexStakeAmount(temp.daysServed, temp.daysStaked, temp.hexInterest, temp.principal, temp.tShare, this.hex),
          }
        }
      )
    }
  }



  public async syncDBFromRarible(ownerAddress: string) {
    var url = this.raribleNFTURL + ownerAddress
    var d = await this.axiosService.get(url);
    var nftIds = [];
    for (let i = 0; i < d.items.length; i++) {
      if (this.CONTRACTID == d.items[i].contract) {
        var nft = await this.create({
          "tokenId": d.items[i].tokenId,
          "contract": d.items[i].contract,
          "title": "",
          "ownerAddress": ownerAddress,
          "meta": {
            "content": d.items[i].meta && d.items[i].meta.content.length >= 1 ? d.items[i].meta.content[0] : {},
            "name": d.items[i].meta ? d.items[i].meta.name : "",
            "discription": "",
          },
          "status": "ACTIVE"
        })
        if(nft){
          nftIds.push({_id: nft._id})
        }
      }
    }
    this.syncStakedMetaAddNft(nftIds);
    return this.findByWhere({ ownerAddress: ownerAddress });
  }
}
