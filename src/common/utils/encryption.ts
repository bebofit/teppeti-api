import bcrypt from 'bcrypt';
import nanoid from 'nanoid/async';

const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 10);

const hashPasswordSync = (password: string): string =>
  bcrypt.hashSync(password, 10);

const comparePasswordToHash = (
  candidatePassword: string,
  hash: string
): Promise<boolean> => bcrypt.compare(candidatePassword, hash);

const genToken = (length?: number): Promise<string> => nanoid(length);

export { hashPassword, hashPasswordSync, comparePasswordToHash, genToken };
