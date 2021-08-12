/*external modules*/
import { Module } from '@nestjs/common';
/*services*/
import { ArticleService } from './article.service';
/*controllers*/
import { ArticleController } from './article.controller';

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
