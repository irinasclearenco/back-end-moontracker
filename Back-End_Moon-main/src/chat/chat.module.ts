import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../iam/config/jwt.config';
import { Moon } from '../moon/entities/moon.entity';
import { MoonService } from '../moon/moon.service';
import { Symptom } from '../symptoms/entities/symptom.entity';
import { PolicyHandlersStorage } from '../iam/authorization/policies/policy-handlers.storage';
import { IamModule } from '../iam/iam.module';
import { User } from '../users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey, Moon, Symptom, Chat]),
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
  controllers: [ChatController],
  providers: [ChatService, MoonService, PolicyHandlersStorage, ChatGateway],
})
export class ChatModule {}
