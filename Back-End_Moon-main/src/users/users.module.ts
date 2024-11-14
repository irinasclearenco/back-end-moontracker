import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../iam/config/jwt.config';
import { Moon } from '../moon/entities/moon.entity';
import { MoonService } from '../moon/moon.service';
import { Symptom } from '../symptoms/entities/symptom.entity';
import { PolicyHandlersStorage } from '../iam/authorization/policies/policy-handlers.storage';
import { IamModule } from '../iam/iam.module';
import { Chat } from '../chat/entities/chat.entity';
import { Article } from '../articles/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey, Moon, Symptom, Chat, Article]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    ConfigModule.forRoot({ load: [jwtConfig] }),
    IamModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, MoonService, PolicyHandlersStorage],
})
export class UsersModule {}
