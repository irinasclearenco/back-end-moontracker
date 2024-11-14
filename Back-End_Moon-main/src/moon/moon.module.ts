import { Module } from '@nestjs/common';
import { MoonService } from './moon.service';
import { MoonController } from './moon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { Moon } from './entities/moon.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../iam/config/jwt.config';
import { Symptom } from '../symptoms/entities/symptom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey, Moon, Symptom]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    ConfigModule.forRoot({ load: [jwtConfig] }),
  ],
  controllers: [MoonController],
  providers: [MoonService],
})
export class MoonModule {}
