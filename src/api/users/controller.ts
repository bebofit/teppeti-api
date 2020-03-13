import { addDays } from 'date-fns';
import { Response } from 'express';
import { CREATED, NOT_FOUND, NO_CONTENT, OK } from 'http-status';
import { Language } from '../../common/enums';
// import { emailsService } from '../../common/services';
import { IRequest } from '../../common/types';
import {
  extractPaginationOptions,
  genToken,
  validateBody,
  validateDBId
} from '../../common/utils';
import * as usersService from './service';
import * as usersValidations from './validations';

async function getUsers(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const data = await usersService.getUsers(paginationOptions);
  res.status(OK).json({
    data
  });
}

async function getUserById(req: IRequest, res: Response): Promise<any> {
  const userId = req.params.userId;
  validateDBId(userId);
  const user = await usersService.getUserById(userId);
  if (!user) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(OK).json({
    data: user
  });
}

async function createUser(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, usersValidations.CREATE);
  const tomorrow = addDays(new Date(), 1);
  Object.assign(body, {
    emailVerificationToken: await genToken(),
    emailVerificationTokenExpiry: tomorrow,
    resetPasswordToken: await genToken(),
    resetPasswordTokenExpiry: tomorrow,
    clientLanguage: Language.English
  });
  const user = await usersService.createUser(body);
  // await emailsService.sendVerificationMail(
  //   body.email,
  //   body.emailVerificationToken,
  //   Language.English,
  //   EntityType.User
  // );
  res.status(CREATED).json({
    data: user
  });
}

async function updateUser(req: IRequest, res: Response): Promise<any> {
  const userId = req.params.userId;
  validateDBId(userId);
  const body = validateBody(req.body, usersValidations.UPDATE);
  const user = await usersService.updateUser(userId, body);
  if (!user) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(OK).json({
    data: user
  });
}

async function softDeleteUser(req: IRequest, res: Response): Promise<any> {
  const userId = req.params.userId;
  validateDBId(userId);
  const isDeleted = await usersService.softDeleteUser(userId);
  if (!isDeleted) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(NO_CONTENT).send();
}

export { getUsers, getUserById, createUser, updateUser, softDeleteUser };
