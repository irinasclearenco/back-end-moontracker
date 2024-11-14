import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../iam/authentication/guards/access-token/access-token.guard';
import { SymptomsService } from './symptoms.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Symptoms')
@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @UseGuards(AccessTokenGuard)
  @Post(':id')
  create(@Param('id') id: string, @Body() createSymptomDto: CreateSymptomDto) {
    return this.symptomsService.create(+id, createSymptomDto);
  }
}
