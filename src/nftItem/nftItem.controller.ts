import { Controller, Get, Post, Param, Put, Body } from '@nestjs/common';
import { NFTItemService } from './nftItem.service';
import { CreateNFTItemDto } from './dtos/nftItem-create.dto'
import { ListNFTItemDto } from './dtos/listNftItem.dto';

@Controller()
export class NFTItemController {

  constructor(
    private readonly nftItemService: NFTItemService,
  ) { }

  @Post()
  async addItem(@Body() itemDto: CreateNFTItemDto) {
    return { item: await this.nftItemService.create(itemDto) };
  }

  @Get('owner-address/:ownerAddress')
  async getOwnerItems(@Param('ownerAddress') ownerAddress: string) {
    const data = await this.nftItemService.findByWhere({ ownerAddress: ownerAddress });
    return { total: data.length, items: data };
  }

  @Get('rarible/owner-address/:ownerAddress')
  async getItemsFromRarible(@Param('ownerAddress') ownerAddress: string) {
    const data = await this.nftItemService.syncDBFromRarible(ownerAddress);
    return { total: data.length, items: data };
  }

  @Put('delist/:id')
  async delistItem(@Param('id') id: string) {
    return { item: await this.nftItemService.delistNFT(id, { price: 0, blockchainIndex: null, status: "DELIST" }) };
  }

  @Put('sold/:id')
  async setItemSold(@Param('id') id: string) {
    return { item: await this.nftItemService.findByIdAndDelete(id) };
  }

  @Put('list/:id')
  async listItem(@Param('id') id: string, @Body() listNftItemDto: ListNFTItemDto) {
    return { item: await this.nftItemService.listNft(id, { price: listNftItemDto.price, blockchainIndex: listNftItemDto.blockchainIndex, status: "LISTED" }) };
  }

  @Get()
  async getListedItems() {
    const data = await this.nftItemService.findByWhere({ status: "LISTED" });
    return { total: data.length, items: data };
  }
}
