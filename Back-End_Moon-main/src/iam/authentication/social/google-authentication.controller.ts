import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleDataDto } from '../dto/google-token.dto';
import { AuthType } from '../enums/auth-type.enum';
import { Auth } from '../decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Social')
@Auth(AuthType.None)
@Controller('authentication/google')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthService: GoogleAuthenticationService,
  ) {}
  @Auth(AuthType.None)
  @Post()
  async authenticate(@Body() dataDto: GoogleDataDto) {
    return this.googleAuthService.authenticate(dataDto);
  }
}
