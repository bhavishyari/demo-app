import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule, ScheduleModule } from 'nest-schedule';
import { Observable } from 'rxjs';
import { NFTItemService } from '../../nftItem/nftItem.service'

ScheduleModule.register({
  enable: true,
  maxRetry: -1,
  retryInterval: 5000,
});

@Injectable()
export class ScheduleService extends NestSchedule {

  constructor(
    private nftItemService: NFTItemService,
  ) {
    super();
  }


  
  // @Cron(' */5 * * * *')
  @Cron('00 00 * * *')
  doJob1(): Observable<any> {
    this.nftItemService.syncStakedMetaCronJob()
    return;
  }
}
