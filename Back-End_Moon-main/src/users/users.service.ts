import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MoonService } from '../moon/moon.service';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private moonService: MoonService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async getUser(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { role: Role.USER } });
  }
  async getAllDoctors(): Promise<User[]> {
    return this.userRepository.find({ where: { role: Role.DOCTOR } });
  }
  async generateAccessCode(userId: number): Promise<string> {
    // Generate a random access code
    const accessCode = Math.random().toString(36).substring(7);
    // Associate the access code with the user in the database
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.accessCode = accessCode;
    await this.userRepository.save(user);
    return accessCode;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const cycleLength = updateUserDto.cycleLength || user.cycleLength;
    const periodLength = updateUserDto.periodLength || user.periodLength;
    const ovulationDay = Math.round(cycleLength / 2);
    const follicularPhaseStart = periodLength + 1;
    const follicularPhaseEnd = ovulationDay + 2;
    const lutealPhaseStart = follicularPhaseEnd + 1;
    const lutealPhaseEnd = cycleLength;
    // Apply updates from the DTO to the user entity
    // Object.assign(user, updateUserDto);
    // Save the updated user entity back to the database
    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
      follicularPhaseStart,
      follicularPhaseEnd,
      ovulationDay,
      lutealPhaseStart,
      lutealPhaseEnd,
    });

    if (user?.moons?.length) {
      await this.moonService.create(new Date(), id);
    }
    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
