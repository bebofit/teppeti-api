import { addDays } from 'date-fns';
import jwt, { VerifyErrors } from 'jsonwebtoken';
// import { AccountType, Role } from '../../common/enums';
import { IAuthInfo, IDBQueryOptions, IDBQuery } from '../../common/types';
import {
  comparePasswordToHash,
  genToken,
  hashPassword,
  isString
} from '../../common/utils';
import config, { isDevelopment } from '../../config';
import { IUser } from '../../database/models';
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
): boolean => comparePasswordToHash(candidatePassword, hash);

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

const updateLastLoginAt = (
  userId: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.updateLastLoginAt(userId, options);

const getAuthUserByEmail = (
  email: string,
  options?: IDBQueryOptions
): IDBQuery<IUser> => repository.findByEmail(email, options);

const getAuthUserByUsername = (
  username: string,
  options?: IDBQueryOptions
): IDBQuery<IUser> => repository.getAuthUserByUsername(username, options);

async function createAuthUserTokenPair(
  user: IUser,
  options?: IDBQueryOptions
): Promise<{ accessToken: string; refreshToken: string }> {
  const authInfo: IAuthInfo = {
    userId: user.id,
    isSuperAdmin: user.isSuperAdmin,
    permissions: user.permissions,
    type: user.type
  };
  const refreshTokenId = await genToken(16);
  const createdAt = new Date();
  const accessExpiresAt = addDays(createdAt, 1);
  const refreshExpiresAt = addDays(createdAt, 30);
  await repository.addRefreshToken(
    user.id,
    {
      createdAt,
      id: refreshTokenId,
      expiresAt: refreshExpiresAt
    },
    options
  );
  const [accessToken, refreshToken] = await Promise.all([
    signJWT({
      ...authInfo,
      jti: refreshTokenId,
      iat: createdAt.valueOf(),
      exp: accessExpiresAt.valueOf()
    }),
    signJWT({
      ...authInfo,
      jti: refreshTokenId,
      iat: createdAt.valueOf(),
      exp: refreshExpiresAt.valueOf()
    })
  ]);
  return { accessToken, refreshToken };
}

export {
  extractToken,
  decodeToken,
  verifyToken,
  isAuthenticated,
  isNotAuthenticated,
  encryptPassword,
  checkForCorrectPassword,
  signJWT,
  updateLastLoginAt,
  getAuthUserByEmail,
  createAuthUserTokenPair,
  getAuthUserByUsername
};
