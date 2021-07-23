import { Controller, Render, Query, Param, Body, ParseIntPipe, Get, Post, Redirect } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './models/article.entity'

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
    async create(@Body() body: any) {
        const article = new Article(body.title, body.content);
        await article.save();
    }

    @Get('/:id')
    @Render('article')
    async getById(@Param('id', ParseIntPipe) id: number, @Query('nextId') nextId: string) {
        const article = await Article.findOne({ id });

        if(article) {
            return {
                ...article,
                nextUrl: nextId && `http://localhost:3100/${nextId}`
            }
        }

        return article;
    }

    @Get('/')
    @Render('index')
    async index() {
        return {
            articles: await Article.find()
        };
    }
}
