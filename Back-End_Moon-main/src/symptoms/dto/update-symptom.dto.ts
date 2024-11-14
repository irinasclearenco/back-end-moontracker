import { IsOptional, IsString } from 'class-validator';

export class UpdateSymptomDto {
  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  symptom: string;
}
