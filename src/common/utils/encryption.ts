import config from '../../config';
import cryptojs from 'crypto-js';
import nanoid from 'nanoid/async';
const { CRYPTO_SECRET } = config;

const hashPassword = (password: string): string =>
  cryptojs.AES.encrypt(password, CRYPTO_SECRET).toString();

const comparePasswordToHash = (
  candidatePassword: string,
  hash: string
): boolean => {
  const bytes = cryptojs.AES.decrypt(hash, CRYPTO_SECRET);
  const exisitngPassword = bytes.toString(cryptojs.enc.Utf8);
  return candidatePassword === exisitngPassword;
};
const genToken = (length?: number): Promise<string> => nanoid(length);

export { hashPassword, comparePasswordToHash, genToken };
