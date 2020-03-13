import { addDays, addMinutes } from 'date-fns';
import jwt, { VerifyErrors } from 'jsonwebtoken';
// import { AccountType, Role } from '../../common/enums';
import {
  IAuthInfo,
  IDBQueryOptions,
  IPermissionType,
  IDBQuery
} from '../../common/types';
import {
  comparePasswordToHash,
  genToken,
  hashPassword,
  isString
} from '../../common/utils';
import config, { isDevelopment } from '../../config';
import { IAuthUser } from '../../database/models';
import repository from './repository';

const { JWT_SECRET } = config;

function extractToken(authHeader: string): string {
  if (!isString(authHeader)) {
    return null;
  }
  const headerParts = authHeader.trim().split(' ');
  if (!(headerParts.length === 2 && headerParts[0] === 'Bearer')) {
    return null;
  }
  return headerParts[1];
}

const verifyToken = (token: string): Promise<any> =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      JWT_SECRET,
      (err: VerifyErrors, authInfo: string | object) => {
        if (err) {
          return reject(err);
        }
        resolve(authInfo);
      }
    );
  });

const decodeToken = (token: string): any => jwt.decode(token);

const isAuthenticated = (token: string): Promise<any> => verifyToken(token);

async function isNotAuthenticated(token: string): Promise<void> {
  try {
    await verifyToken(token);
    return Promise.reject();
  } catch (err) {
    return Promise.resolve();
  }
}

const encryptPassword = hashPassword;

const checkForCorrectPassword = (
  candidatePassword: string,
  hash: string
): Promise<boolean> => comparePasswordToHash(candidatePassword, hash);

function signJWT(
  data?: any,
  expiresIn: string | number = isDevelopment ? '24h' : '5m'
): Promise<string> {
  const options = data.exp ? {} : { expiresIn };
  return new Promise((resolve, reject) => {
    jwt.sign(data, JWT_SECRET, options, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

const getAuthUserByEmail = (
  email: string,
  options?: IDBQueryOptions
): IDBQuery<IAuthUser> => repository.findByEmail(email, options);

const getAuthUserByMobile = (
  mobile: string,
  options?: IDBQueryOptions
): IDBQuery<IAuthUser> => repository.findByMobile(mobile, options);

export {
  extractToken,
  decodeToken,
  verifyToken,
  isAuthenticated,
  isNotAuthenticated,
  encryptPassword,
  checkForCorrectPassword,
  signJWT,
  getAuthUserByEmail,
  getAuthUserByMobile
};
