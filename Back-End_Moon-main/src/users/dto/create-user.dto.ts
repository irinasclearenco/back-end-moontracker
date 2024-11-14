import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { Goal } from '../enums/goal.enum';
import { Column } from 'typeorm';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  about: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Goal)
  goal: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  birthday: Date;

  @IsNumber()
  cycleLength: number;

  @IsNumber()
  periodLength: number;

  @IsNumber()
  follicularPhaseStart: number;

  @IsNumber()
  follicularPhaseEnd: number;

  @IsNumber()
  ovulationDay: number;

  @IsNumber()
  lutealPhaseStart: number;

  @IsNumber()
  lutealPhaseEnd: number;

  @IsBoolean()
  isTfaEnabled: boolean;

  @IsString()
  tfaSecret: string;

  @IsString()
  googleId: string;
}
