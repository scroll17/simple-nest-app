/*external modules*/
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
/*modules*/
import { UserModule } from './modules/user/user.module';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatsModule } from './modules/cats/cats.module';
import { RedisModule } from "./modules/redis/redis.module";
/*services*/
import { AppService } from './app.service';
/*controllers*/
import { AppController } from './app.controller';
import { CatsController } from './modules/cats/cats.controller';
/*@entities*/
import { Article } from '@entities/article/article.entity';
import { User } from '@entities/user/user.entity';
/*@common*/
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { AllExceptionsFilter } from '@common/filters/all-exeption.filter';
import { AuthGuard } from '@common/guards/auth.guard';

@Module({
  imports: [
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: `postgresql://test:test@database:5432/simple_shop`,
      entities: [Article, User],
      logging: true,
      synchronize: true,
      /**
       * Эта настройка означает, что при каждом запуске приложения
       * схема БД будет приобретать ту форму, которую мы описываем в коде (классы, помеченные @Entity)
       * */
    }),
    UserModule,
    ArticleModule,
    AuthModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
