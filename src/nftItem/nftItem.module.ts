import { NFTItemService } from './nftItem.service';
import { NFTItemController } from './nftItem.controller';
import { NFTItems } from '../@schemas/index';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from '@core/core.module';
import { HexUtility } from './hex-utility';
import {NFTMiddleware} from "./nft.middleware";
import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';

const Schemas = [NFTItems];

@Module({
  imports: [ MongooseModule.forFeature(Schemas), CoreModule],
  providers: [NFTItemService,HexUtility],
  controllers: [NFTItemController],
  exports: [NFTItemService],
})


export class NFTItemModule {}


// export class NFTItemModule implements NestModule {
//   public configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(NFTMiddleware)
//       .forRoutes({path: 'v1/nft/', method: RequestMethod.ALL});
//   }
// }
