import "reflect-metadata";

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { AllExceptionsFilter } from '@core/utils/exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  app.enable('trust proxy');
  app.use(compression());

  // ADD SUPPORT FOR BODY/URL-ENCODED REST APIs
  app.use(bodyParser.urlencoded({ extended: true, limit: '8mb' }));
  app.use(bodyParser.json({ limit: '8mb' }));

  // MORGAN LOGGER
  app.use(morgan('dev'));
  app.enableCors();
  
  await app.listen(process.env.PORT);
  console.log("ENV ",process.env.NODE_ENV)
}
bootstrap();
