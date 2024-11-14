import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoonModule } from './moon/moon.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { SymptomsModule } from './symptoms/symptoms.module';
import { ChatModule } from './chat/chat.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MoonModule,
    UsersModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    IamModule,
    SymptomsModule,
    ChatModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
