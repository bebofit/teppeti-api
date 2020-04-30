import {
  CONFLICT,
  CREATED,
  NOT_FOUND,
  NO_CONTENT,
  OK,
  UNPROCESSABLE_ENTITY
} from 'http-status';
import supertest from 'supertest';
import app from '../../app';
import { startDB, stopDB } from '../../database';
import faker from '../../lib/faker';
import { signJWT } from '../auth/service';
import authRepository from './repository';
import * as authService from './service';
import * as usersService from '../users/service';
import { BODY_VALIDATION, PARAMS_VALIDATION } from '../../common/errors';
import { Language } from '../../common/enums';

const request = supertest(app);

describe('Admin API', () => {
  let apiUrl: string;
  let createBody: () => any;
  let registerMobileBody: () => any;

  beforeAll(async () => {
    await startDB();
    apiUrl = '/api/auth/v1';
    createBody = () => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      clientLanguage: faker.helpers.randomize(Object.values(Language))
    });
    registerMobileBody = () => ({
      mobile: faker.phone.phoneNumber()
    });
  });

  beforeEach(async () => {
    await authRepository.deleteAll();
  });

  afterAll(async () => {
    apiUrl = null;
    createBody = null;
    registerMobileBody = null;
    await stopDB();
  });
});
