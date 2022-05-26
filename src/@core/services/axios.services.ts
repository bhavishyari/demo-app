import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AxiosService {
  constructor(
    private httpService: HttpService,
  ) { }

  public async get(url: string): Promise<any> {
    var data: object;
    await this.httpService.get(url)
      .toPromise()
      .then(res => {
        data = res.data;
      })
      .catch(err => {
        console.log(err);
      })
    return data;
  }
}
