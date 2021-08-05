import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import { Article } from '@entities/article/article.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'simple_shop',
      schema: 'public',
      entities: [Article],
      // entities: ["src/modules/**/models/**.entity{.ts,.js}"],
      logging: true,
      synchronize: true,
      /**
       * Эта настройка означает, что при каждом запуске приложения
       * схема БД будет приобретать ту форму, которую мы описываем в коде (классы, помеченные @Entity)
       * */
    }),
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
