import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Symptom } from '../../symptoms/entities/symptom.entity';

export class UpdateMoonDto {
  @IsOptional()
  @IsString()
  date: Date;

  @IsOptional()
  @IsNumber()
  cycleDay: number;

  @IsOptional()
  @IsString()
  phase: string;

  @IsOptional()
  @IsBoolean()
  startingDay: boolean;

  @IsOptional()
  @IsBoolean()
  endingDay: boolean;

  @IsOptional()
  symptoms: Symptom[];

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  lmp: string;

  @IsOptional()
  @IsString()
  edd: string;
}
