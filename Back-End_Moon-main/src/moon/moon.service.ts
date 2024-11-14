import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { Moon } from './entities/moon.entity';
import { BabySize } from './consts';

@Injectable()
export class MoonService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Moon)
    private readonly moonRepository: Repository<Moon>,
  ) {}

  calculateEDD(lastMenstrualPeriod) {
    const lmp = new Date(lastMenstrualPeriod);
    const edd = new Date(lmp);

    // Add 280 days to the LMP to get the EDD
    edd.setDate(lmp.getDate() + 280);
    return edd;
  }
  async getMenstrualCycleData(
    accessCode: string,
  ): Promise<{ [key: string]: Moon }> {
    // Find the user associated with the access code
    const user = await this.userRepository.findOne({ where: { accessCode } });
    if (!user) {
      throw new Error('Invalid access code');
    }
    // Retrieve the menstrual cycle data for the user
    const cycles = await this.moonRepository.find({
      where: { userId: user.id },
      relations: ['symptoms', 'user'],
    });
    if (!cycles?.length) {
      throw new NotFoundException('Not found');
    }
    return cycles.reduce((acc, cycle) => {
      // Using the date as the key and the entire cycle object as the value
      acc[cycle.date.toString()] = cycle; // Ensure the date format is YYYY-MM-DD
      return acc;
    }, {});
  }

  async createPregnancyCycle(cycles, startCycleDay, id) {
    const lastCycleStart =
      cycles?.find((el) => el?.date === startCycleDay)?.lmp || startCycleDay;
    const edd = this.calculateEDD(lastCycleStart);
    await this.moonRepository.delete({
      userId: id,
      date: Between(lastCycleStart, edd),
    });
    for (let day = 1; day <= 280; day++) {
      const moon = new Moon();
      moon.userId = id;
      moon.date = new Date(
        new Date(lastCycleStart).getTime() + (day - 1) * 24 * 60 * 60 * 1000,
      );
      moon.cycleDay = day;
      if (day === 1) {
        moon.startingDay = true;
        moon.endingDay = false;
      } else if (day === 280) {
        moon.startingDay = false;
        moon.endingDay = true;
      } else {
        moon.startingDay = false;
        moon.endingDay = false;
      }
      moon.lmp = lastCycleStart;
      moon.edd = edd.toISOString();
      moon.phase = 'Pregnancy';
      moon.color = '#FFCA4B';
      moon.img = BabySize.find((el) => el.week === Math.ceil(day / 7))?.img;
      moon.text = BabySize.find((el) => el.week === Math.ceil(day / 7))?.text;
      await this.moonRepository.save(moon);
    }
  }
  async createCycle(
    startCycleDay,
    cycleLength,
    periodLength,
    ovulationDay,
    follicularPhaseStart,
    follicularPhaseEnd,
    lutealPhaseStart,
    lutealPhaseEnd,
    id,
  ) {
    let cycleDay = 0;
    const moons: Moon[] = [];
    for (let day = 1; day <= cycleLength * 3; day++) {
      cycleDay++;
      if (cycleDay > cycleLength) {
        cycleDay = 1;
      }
      const moon = new Moon();
      moon.userId = id;
      moon.date = new Date(
        new Date(startCycleDay).getTime() + (day - 1) * 24 * 60 * 60 * 1000,
      );
      moon.cycleDay = cycleDay;
      moon.startingDay =
        cycleDay === 1 ||
        cycleDay === follicularPhaseStart ||
        cycleDay === ovulationDay ||
        cycleDay === lutealPhaseStart;
      moon.endingDay =
        cycleDay === periodLength ||
        cycleDay === ovulationDay ||
        cycleDay === follicularPhaseEnd ||
        cycleDay === lutealPhaseEnd;
      moon.phase = this.getPhase(
        cycleDay,
        periodLength,
        follicularPhaseStart,
        follicularPhaseEnd,
        ovulationDay,
        lutealPhaseStart,
        lutealPhaseEnd,
      );
      moon.color = this.getColor(moon.phase); // Implement this based on your phase-color mapping
      moon.lmp = new Date(
        new Date(startCycleDay).getTime() +
          (day - cycleDay) * 24 * 60 * 60 * 1000,
      );
      moons.push(moon);
    }
    // Optionally save to DB or just return the prediction
    await this.moonRepository.delete({
      userId: id,
      date: Between(
        startCycleDay,
        new Date(
          new Date(startCycleDay).getTime() +
            cycleLength * 3 * 24 * 60 * 60 * 1000,
        ),
      ),
    });

    return await this.moonRepository.save(moons);
  }
  async create(startCycleDay, id) {
    const {
      cycleLength,
      periodLength,
      ovulationDay,
      follicularPhaseStart,
      follicularPhaseEnd,
      lutealPhaseStart,
      lutealPhaseEnd,
      goal,
    } = await this.userRepository.findOne({ where: { id } });
    const cycles = await this.moonRepository.find({ where: { userId: id } });

    if (!cycleLength) {
      throw new NotFoundException('User not found');
    }

    if (goal === 'MONITORING_PREGNANCY') {
      this.createPregnancyCycle(cycles, startCycleDay, id);
    } else {
      await this.createCycle(
        startCycleDay,
        cycleLength,
        periodLength,
        ovulationDay,
        follicularPhaseStart,
        follicularPhaseEnd,
        lutealPhaseStart,
        lutealPhaseEnd,
        id,
      );
    }
    // return moons;
  }
  private getPhase(
    day: number,
    periodLength: number,
    follicularPhaseStart: number,
    follicularPhaseEnd: number,
    ovulationDay: number,
    lutealPhaseStart: number,
    lutealPhaseEnd: number,
  ): string {
    if (day >= 1 && day <= periodLength) {
      return 'Menstrual';
    } else if (day === ovulationDay) {
      return 'Ovulation';
    } else if (day >= follicularPhaseStart && day <= follicularPhaseEnd) {
      return 'Follicular';
    } else if (day >= lutealPhaseStart && day <= lutealPhaseEnd) {
      return 'Luteal';
    }
    return 'Unknown';
  }
  private getColor(phase: string): string {
    switch (phase) {
      case 'Menstrual':
        return 'pink';
      case 'Follicular':
        return '#c7e8f8';
      case 'Ovulation':
        return '#91c5fc';
      case 'Luteal':
        return '#f8f6ed';
      default:
        return 'gray';
    }
  }
  async getCycles(id: number): Promise<{ [key: string]: Moon }> {
    const cycles = await this.moonRepository.find({
      where: { userId: id },
      relations: ['symptoms'],
    });
    if (!cycles?.length) {
      throw new NotFoundException('Not found');
    }
    return cycles.reduce((acc, cycle) => {
      // Using the date as the key and the entire cycle object as the value
      acc[cycle.date.toString()] = cycle; // Ensure the date format is YYYY-MM-DD
      return acc;
    }, {});
  }

  async getAllCycles(): Promise<Moon[]> {
    const cycles = await this.moonRepository.find({
      where: { date: Between(new Date('2023-01-01'), new Date()) },
      relations: ['symptoms'],
    });
    if (!cycles?.length) {
      throw new NotFoundException('Not found');
    }

    return cycles;
  }

  findOne(id: number) {
    return `This action returns a #${id} moon`;
  }

  remove(id: number) {
    return `This action removes a #${id} moon`;
  }
  // Example function to create a new symptom category
}
