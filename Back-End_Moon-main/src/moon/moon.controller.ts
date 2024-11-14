import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { MoonService } from './moon.service';
import { CreateMoonDto } from './dto/create-moon.dto';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../iam/authentication/guards/access-token/access-token.guard';
import { User } from '../users/entities/user.entity';
import { REQUEST_USER_KEY } from '../iam/iam.constants';
import { Moon } from './entities/moon.entity';

@ApiTags('Moon')
@Controller('moon')
export class MoonController {
  constructor(private readonly moonService: MoonService) {}

  @UseGuards(AccessTokenGuard)
  @Auth(AuthType.Bearer, AuthType.ApiKey)
  @Get('/all')
  getAll() {
    return this.moonService.getAllCycles();
  }

  @UseGuards(AccessTokenGuard)
  @Auth(AuthType.Bearer, AuthType.ApiKey)
  @Post()
  create(@Body() { startCycleDay }: CreateMoonDto, @Req() req: Request) {
    const userId: User = req[REQUEST_USER_KEY].sub;
    // Assuming req.user contains the user information extracted from the access token
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.moonService.create(startCycleDay, +userId);
  }
  @UseGuards(AccessTokenGuard)
  @Auth(AuthType.Bearer, AuthType.ApiKey)
  @Get()
  findAll(@ActiveUser() user: ActiveUserData, @Req() req: Request) {
    const userId: User = req[REQUEST_USER_KEY].sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.moonService.getCycles(+userId);
  }

  @UseGuards(AccessTokenGuard)
  @Auth(AuthType.Bearer, AuthType.ApiKey)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moonService.getCycles(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moonService.remove(+id);
  }

  @Post('/get-data-by-access-code/:accessCode')
  async viewMenstrualCycleData(
    @Param('accessCode') accessCode: string,
  ): Promise<{ [key: string]: Moon }> {
    return this.moonService.getMenstrualCycleData(accessCode);
  }
}
