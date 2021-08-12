/*external modules*/
import { Injectable } from '@nestjs/common';
/*@entities*/
import { Article } from '@entities/article/article.entity';

@Injectable()
export class ArticleService {
  async create(title: string, content: string) {
    const article = new Article(title, content);
    await article.save();
  }

  async findById(id: number, nextId?: string) {
    const article = await Article.findOne(id);

    if (article) {
      return {
        ...article,
        nextUrl: nextId && `http://localhost:3100/${nextId}`,
      };
    }

    return article;
  }

  async findAll() {
    return Article.find();
  }
}
