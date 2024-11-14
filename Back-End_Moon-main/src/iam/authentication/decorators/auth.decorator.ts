import { AuthType } from '../enums/auth-type.enum';
import { SetMetadata } from '@nestjs/common';

export const AUTH_KEY_TYPE = 'authType';

export const Auth = (...authType: AuthType[]) =>
  SetMetadata(AUTH_KEY_TYPE, authType);
