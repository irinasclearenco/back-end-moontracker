import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../iam/authentication/guards/access-token/access-token.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }
  @UseGuards(AccessTokenGuard)
  @Get()
  async get() {
    return this.articlesService.getAll();
  }
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.articlesService.getPostsByUserId(+id);
  }
}
