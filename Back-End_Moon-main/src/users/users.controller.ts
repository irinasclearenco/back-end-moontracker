import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Request,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from '../iam/authentication/guards/access-token/access-token.guard';
import { REQUEST_USER_KEY } from '../iam/iam.constants';
import { PoliciesGuard } from '../iam/authorization/guards/policies.guard';
import { Policies } from '../iam/authorization/decorators/policies.decorator';
import { FrameworkContributorPolicy } from '../iam/authorization/policies/framework-contributor.policy';
import { Role } from './enums/role.enum';
import { RolesGuard } from '../iam/authorization/guards/roles.guard';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  //

  // @Policies()
  @UseGuards(AccessTokenGuard)
  @Get()
  async getUser(@Req() req: Request): Promise<User> {
    const userId: User = req[REQUEST_USER_KEY].sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.getUser(+userId);
  }

  @Post('/generate-access-code')
  async generateAccessCode(
    @Body('userId') userId: number,
  ): Promise<{ accessCode: string }> {
    const accessCode = await this.usersService.generateAccessCode(userId);
    return { accessCode };
  }
  @UseGuards(AccessTokenGuard)
  @Get('/all')
  async getAllUsers(@Req() req: Request): Promise<User[]> {
    const userId: User = req[REQUEST_USER_KEY].sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.getAllUsers();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/doctors')
  async getAllDoctors(@Req() req: Request): Promise<User[]> {
    const userId: User = req[REQUEST_USER_KEY].sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.getAllDoctors();
  }
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(+id);
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch()
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    const userId: User = req[REQUEST_USER_KEY].sub;
    // Assuming req.user contains the user information extracted from the access token
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    // Update the user's profile with the data from updateUserDto
    const updatedUser = await this.usersService.updateUser(
      +userId,
      updateUserDto,
    );
    return updatedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
