import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NFTItemModule } from '../nftItem/nftItem.module';
import * as fs from 'fs';

@Module({
  imports: [
    NFTItemModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [ AuthService],
})
export class AuthModule { }