import { addDays } from 'date-fns';
import { Response } from 'express';
import { CONFLICT, CREATED, OK } from 'http-status';
import { IRequest } from '../../common/types';
import { genToken, hashPassword, validateBody } from '../../common/utils';
import { startTransaction } from '../../database';
import { ACCOUNT_NOT_VERIFIED } from './errors';
import * as authService from './service';
import * as authValidations from './validations';
import * as usersService from '../users/service';
import { AccountType } from '../../common/enums';

async function registerUser(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.REGISTER_USER);
  const existingAuthUser = await authService.getAuthUserByMobile(body.mobile);
  if (existingAuthUser) {
    throw {
      statusCode: CONFLICT
    };
  }
  const tomorrow = addDays(new Date(), 1);
  Object.assign(body, {
    password: await hashPassword(body.password),
    emailVerificationToken: await genToken(),
    emailVerificationTokenExpiry: tomorrow
  });
  await usersService.createUser(body);
  // await emailsService.sendVerificationMail(
  //   body.email,
  //   body.emailVerificationToken,
  //   body.clientLanguage,
  //   EntityType.User
  // );
  res.status(CREATED).send();
}

async function registerMobile(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.REGISTER_MOBILE);
  const existingAuthUser = await authService.getAuthUserByMobile(body.mobile);
  if (existingAuthUser) {
    throw {
      statusCode: CONFLICT
    };
  }
  // To-do: send twillio message to phone
  await usersService.createUser(body);
  res.status(CREATED).send();
}

export { registerUser, registerMobile };
