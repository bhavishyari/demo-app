import { Module, Global, DynamicModule, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScheduleService } from './services/scheduler.service';
import { AxiosService } from './services/axios.services';
import { NFTItemModule } from '../nftItem/nftItem.module';
const PROVIDERS = [ScheduleService,AxiosService];

const Schemas = [];

@Global()
@Module({})
export class CoreModule {

  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [HttpModule, MongooseModule.forFeature(Schemas), NFTItemModule],
      providers: [...PROVIDERS],
      exports: [...PROVIDERS],
    };
  }

}
