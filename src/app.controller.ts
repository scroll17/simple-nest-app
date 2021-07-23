import { Controller, Render, Query, Param, Body, ParseIntPipe, Get, Post, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { Article } from './modules/article/models/article.entity'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
