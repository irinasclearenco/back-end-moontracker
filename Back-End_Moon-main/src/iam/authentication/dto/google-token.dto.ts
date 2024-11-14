import { IsNotEmpty, IsOptional } from 'class-validator';

export class GoogleDataDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  family_name: string;

  @IsNotEmpty()
  given_name: string;

  @IsNotEmpty()
  id: string;

  @IsOptional()
  locale: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  picture: string;

  @IsNotEmpty()
  verified_email: boolean;
}
