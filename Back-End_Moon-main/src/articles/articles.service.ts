import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const post = this.articlesRepository.create(createArticleDto);
    post.createdAt = new Date();
    return this.articlesRepository.save(post);
  }
  async getAll() {
    return this.articlesRepository.find({ order: { createdAt: 'DESC' } });
  }
  async getPostsByUserId(id: number) {
    return this.articlesRepository.find({
      where: { userId: id },
      order: { createdAt: 'DESC' },
    });
  }
}
