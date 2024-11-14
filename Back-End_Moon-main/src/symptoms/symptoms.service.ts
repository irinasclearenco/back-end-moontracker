import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moon } from '../moon/entities/moon.entity';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { Symptom } from './entities/symptom.entity';

@Injectable()
export class SymptomsService {
  constructor(
    @InjectRepository(Moon)
    private readonly moonRepository: Repository<Moon>,
    @InjectRepository(Symptom)
    private readonly symptomsRepository: Repository<Symptom>,
  ) {}

  async create(id: number, createSymptomDto: CreateSymptomDto) {
    const moon = await this.moonRepository.findOneBy({ id });
    if (!moon) {
      throw new NotFoundException(`Moon with ID "${id}" not found`);
    }
    const existingSymptom = await this.symptomsRepository.findOne({
      where: {
        symptom: createSymptomDto.symptom,
        moon: { id },
      },
    });
    if (existingSymptom) {
      return await this.symptomsRepository.remove(existingSymptom);
    }
    const symptom = new Symptom();
    symptom.category = createSymptomDto.category;
    symptom.symptom = createSymptomDto.symptom;
    symptom.moon = moon;
    const newSymptom = await this.symptomsRepository.save(symptom);
    return newSymptom;
  }
}
