import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { Goal } from '../enums/goal.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(Goal)
  goal: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  birthday?: Date;

  @IsOptional()
  @IsNumber()
  cycleLength?: number;

  @IsOptional()
  @IsNumber()
  periodLength?: number;

  @IsOptional()
  @IsNumber()
  follicularPhaseStart: number;

  @IsOptional()
  @IsNumber()
  follicularPhaseEnd: number;

  @IsOptional()
  @IsNumber()
  ovulationDay: number;

  @IsOptional()
  @IsNumber()
  lutealPhaseStart: number;

  @IsOptional()
  @IsNumber()
  lutealPhaseEnd: number;

  @IsOptional()
  @IsBoolean()
  isTfaEnabled?: boolean;

  @IsOptional()
  @IsString()
  tfaSecret?: string;

  @IsOptional()
  @IsString()
  googleId?: string;
}
