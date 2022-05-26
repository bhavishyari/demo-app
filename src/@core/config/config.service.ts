import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { join } from 'path';

export class ConfigService {
  private readonly DEFAULT_MESSAGE = 'MESSAGE';
  private readonly envConfig: { [key: string]: string };

  private readonly toArabicNumber =
    (num: string) => String.fromCharCode(num.charCodeAt(0) + 1584);

  private readonly modifyNumbers =
    (str: string) => str.replace(/\d/g, this.toArabicNumber);

  constructor() {
    try {
      const envConfig = dotenv.parse(fs.readFileSync('.env'));
      process.env.NODE_ENV = envConfig.NODE_ENV;

      const TO_ROOT = '../../../';
      const ENV_PATH = join(__dirname, TO_ROOT, `.env`);

      this.envConfig = dotenv.config({ path: ENV_PATH }).parsed || {};
    } catch (e){
      console.log(e)
    }
  }

  public getEnv(key: string): string {
    return this.envConfig[key];
  }
}
