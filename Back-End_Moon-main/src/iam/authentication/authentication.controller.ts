import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { response, Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';
import { ApiTags } from '@nestjs/swagger';
import { Policies } from '../authorization/decorators/policies.decorator';
import { FrameworkContributorPolicy } from '../authorization/policies/framework-contributor.policy';
import { PoliciesGuard } from '../authorization/guards/policies.guard';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly optAuthService: OtpAuthenticationService,
  ) {}

  @Auth(AuthType.None)
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() signUpDto: SignUpDto,
  ) {
    await this.authService.singUp(signUpDto);
    const tokens = await this.authService.singIn(signUpDto);
    response.cookie('access_token', tokens.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return tokens;
  }

  @Auth(AuthType.None)
  @Post('sign-up')
  async signInByCode(
    @Res({ passthrough: true }) response: Response,
    @Body() signUpDto: SignUpDto,
  ) {
    await this.authService.singUp(signUpDto);
    const tokens = await this.authService.singIn(signUpDto);
    response.cookie('access_token', tokens.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return tokens;
  }
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
  @HttpCode(HttpStatus.OK)
  // @Policies(new FrameworkContributorPolicy())
  // @UseGuard(PoliciesGuard)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const tokens = await this.authService.singIn(signInDto);
    response.cookie('access_token', tokens.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return tokens;
  }
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() res: Response,
  ) {
    const { secret, uri } = await this.optAuthService.generateSecret(
      activeUser.email,
    );
    await this.optAuthService.enableTfaForUser(activeUser.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }
}
