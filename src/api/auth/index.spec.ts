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

  describe('Register Mobile', () => {
    it('Should throw a body validation error on incorrect fields in the body', async () => {
      // Arrange
      const body = {};
      // Act
      const res = await request.post(`${apiUrl}/registerMobile`).send(body);
      // Assert
      expect(res).toHaveProperty('status', UNPROCESSABLE_ENTITY);
      expect(res.body).toHaveProperty('errorCode', BODY_VALIDATION);
    });

    it('Should fail if an admin with the provided email exists', async () => {
      // Arrange
      const body = registerMobileBody();
      await usersService.createUser(body);
      // Act
      const res = await request.post(`${apiUrl}/registerMobile`).send(body);
      // Assert
      expect(res).toHaveProperty('status', CONFLICT);
    });

    it('Should register user mobile', async () => {
      // Arrange
      const body = registerMobileBody();
      // Act
      const res = await request.post(`${apiUrl}/registerMobile`).send(body);
      // Assert
      expect(res).toHaveProperty('status', CREATED);
      const createdUser = await authService.getAuthUserByMobile(body.mobile);
      expect(body.mobile).toEqual(createdUser.mobile);
    });
  });
});
