import { Response } from 'express';
import { NOT_FOUND, OK, UNAUTHORIZED } from 'http-status';
import { IRequest } from '../../common/types';
import { validateBody } from '../../common/utils';
import { ACCOUNT_NOT_FOUND } from './errors';
import * as authService from './service';
import * as authValidations from './validations';

async function login(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.LOGIN);
  const authUser = await authService.getAuthUserByUsername(body.username);
  if (!authUser) {
    throw { statusCode: NOT_FOUND, errorCode: ACCOUNT_NOT_FOUND };
  }
  const passwordMatches = authService.checkForCorrectPassword(
    body.password,
    authUser.password
  );
  if (!passwordMatches) {
    throw { statusCode: UNAUTHORIZED };
  }
  await authService.updateLastLoginAt(authUser.id);
  const {
    accessToken,
    refreshToken
  } = await authService.createAuthUserTokenPair(authUser);
  res.status(OK).json({
    data: {
      accessToken,
      refreshToken,
      user: authUser
    }
  });
}

export { login };
