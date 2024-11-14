import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { Symptom } from './entities/symptom.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../iam/config/jwt.config';
import { SymptomsController } from './symptoms.controller';
import { SymptomsService } from './symptoms.service';
import { Moon } from '../moon/entities/moon.entity';

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
  controllers: [SymptomsController],
  providers: [SymptomsService],
})
export class SymptomsModule {}
