import { IsInt, Min, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsBiggerThan } from '../is-bigger-than';
export class ListNFTItemDto {
    @IsNotEmpty()
    @ApiModelProperty()
    @IsBiggerThan('price', {
        message: 'Price must greter than 0',
    })
    price: number;
    @IsNotEmpty()
    @ApiModelProperty()
    @IsInt()
    @Min(0)
    blockchainIndex: number;
}