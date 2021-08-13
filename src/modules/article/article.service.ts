/*external modules*/
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
/*@entities*/
import { Article } from '@entities/article/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {
  }

  async create(title: string, content: string) {
    const article = this.articleRepository.create({
      title,
      content
    });

    await article.save();
  }

  async findById(id: number, nextId?: string) {
    const article = await this.articleRepository.findOne(id);

    if (article) {
      return {
        ...article,
        nextUrl: nextId && `http://localhost:3100/${nextId}`,
      };
    }

    return article;
  }

  async findAll() {
    return this.articleRepository.find();
  }
}
