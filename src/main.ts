import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
// import { AllExceptionsFilter } from './common/exceptions/exception.filter';

import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    ['/api/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        admin: '123',
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  app.useBodyParser('json', { limit: '10mb' });

  const config = new DocumentBuilder()
    .setTitle('Auth Demo')
    .setDescription('The Auth Demo API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
