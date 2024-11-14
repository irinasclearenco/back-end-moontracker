import { IsOptional, IsString } from 'class-validator';

export class CreateSymptomDto {
  @IsString()
  category: string;

  @IsString()
  symptom: string;

  moonId: number;
}
