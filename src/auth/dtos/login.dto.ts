import { IsInt, Min, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class LoginDto {
    @IsNotEmpty()
    @ApiModelProperty()
    signature_message: string;
    @IsNotEmpty()
    @ApiModelProperty()
    signature_hash: string;
    @IsNotEmpty()
    @ApiModelProperty()
    public_address: string;

}