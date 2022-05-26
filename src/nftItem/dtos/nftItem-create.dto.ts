import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateNFTItemDto {
  @IsNotEmpty()
  @ApiModelProperty()
  tokenId: string;
  @IsNotEmpty()
  @ApiModelProperty()
  contract: string;
  @IsNotEmpty()
  @ApiModelProperty()
  title: string;
  @IsNotEmpty()
  @ApiModelProperty()
  ownerAddress: string;
  meta?: object;
  status?: string;
  image?: string;
  animation_url?: string;
  stakedMeta?: object;
  blockchainIndex?: number;
}
