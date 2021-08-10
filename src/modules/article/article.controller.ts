import {
  Controller,
  Render,
  Query,
  Param,
  Body,
  ParseIntPipe,
  Get,
  Post,
  Redirect,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/form')
  @Render('create-article')
  getForm(): void {
    return;
  }

  @Post('/create')
  @Redirect('/article', 301)
  async create(@Body() body: CreateArticleDto) {
    await this.articleService.create(body.title, body.content);
  }

  @Get('/:id')
  @Render('article')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Query('nextId') nextId?: string,
  ) {
    return this.articleService.findById(id, nextId);
  }

  @Get('/')
  @Render('index')
  async index() {
    return this.articleService.findAll();
  }
}
