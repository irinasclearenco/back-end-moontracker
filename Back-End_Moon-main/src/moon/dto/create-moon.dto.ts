import { IsString } from 'class-validator';

export class CreateMoonDto {
  @IsString()
  startCycleDay: Date;

  id?: number;
}
