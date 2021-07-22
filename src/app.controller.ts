import { Controller, Render, Query, Param, Body, ParseIntPipe, Get, Post, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { articles } from './articles/articles'
import { Article } from './articles/article.model'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('create')
  @Render('create-article')
  getForm(): void {
    return;
  }

  @Post('articles')
  @Redirect('/', 301)
  create(@Body() body: any): void {
    const id = articles.length + 1;
    const article = new Article(body.title, body.content, id);
    articles.push(article);
  }

  @Get(':id')
  @Render('article')
  getById(@Param('id', ParseIntPipe) id: number, @Query('nextId') nextId: string) {
    const article = articles.find(article => article.id === id);
    if(article) {
      return {
        ...article,
        nextUrl: nextId && `http://localhost:3100/${nextId}`
      }
    }

    return article;
  }

  @Get()
  @Render('index')
  index() {
    return { articles };
  }
}
