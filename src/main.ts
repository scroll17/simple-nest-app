/*external modules*/
import { join } from 'path';
import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { ConfigService } from '@nestjs/config';
/*modules*/
import { AppModule } from './app.module';


dotenv.config();

const options = new DocumentBuilder()
  .setTitle('OC Auth')
  .setDescription('Auth microservice 🚀')
  .setVersion('1.0')
  // .setBasePath(BASE_URL)
  .addCookieAuth() // Brier token
  .build();

async function bootstrap() {
  /*
   * Добавим параметр типа к методу create, показывая, что мы хотим работать
   * с объектом app, как с приложением express.
   */
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Сообщим приложению, где искать наши views.
  app.setBaseViewsDir(join(__dirname, '../views'));

  // И укажем, какой шаблонизатор использовать
  app.setViewEngine('pug');

  // привязка ValidationPipe на уровне приложения, чтобы обеспечить защиту всех конечных точек от получения неверных данных.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // app.useGlobalPipes(new PipeTransform());

  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('/auth/docs', app, document);

  await app.listen(3100);
}
bootstrap();

/**
 *  Plan:
 *    1. Auth
 *      use JWT with Passport
 *
 *      - with Google
 * */
