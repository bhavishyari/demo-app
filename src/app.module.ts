import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { ConfigModule } from './@core/config/config.module';
import { ConfigService } from './@core/config/config.service';
import { CoreModule } from './@core/core.module';
import { NFTItemModule } from './nftItem/nftItem.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';

const MongooseConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri:    process.env.MONGODB_URI, //process.env.configService.getEnv('MONGODB_URI,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  }),
};

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync(MongooseConfig),
    RouterModule.forRoutes(routes),
    CoreModule.forRoot(),
    AuthModule,
    NFTItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}