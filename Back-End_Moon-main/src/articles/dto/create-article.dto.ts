import { IsNumber, IsString } from 'class-validator'; // Assuming the path to the User entity

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  image: number;

  @IsString()
  by: string;

  @IsNumber()
  userId: number;
}
