/*external modules*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
/*services*/
import { ArticleService } from './article.service';
/*controllers*/
import { ArticleController } from './article.controller';
/*@entities*/
import { Article } from "@entities/article";

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
