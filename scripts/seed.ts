import dotenv from 'dotenv';
dotenv.config();

import { startDB, stopDB, dropDB } from '../src/database';
import authRepository from '../src/api/auth/repository';
import { hashPassword } from '../src/common/utils';

async function seedSuperAdmin(): Promise<void> {
  const body = {
    name: 'Abo Mervat',
    email: 'superadmin@teppeti.me',
    isSuperAdmin: true,
    branch: 'SA',
    permissions: {
      sales: { T: true, S: true, A: true },
      products: { T: true, S: true, A: true },
      movingStock: { T: true, S: true, A: true },
      trials: { T: true, S: true, A: true }
    },
    username: 'abomervat',
    password: hashPassword('123123123'),
    mobile: '12313123123213'
  };
  await authRepository.create(body);
}

async function seedArkan(): Promise<void> {
  const body1 = {
    name: 'Mervat',
    email: 'mervat@teppeti.me',
    branch: 'A',
    permissions: {
      sales: { T: false, S: false, A: true },
      products: { T: false, S: false, A: true },
      movingStock: { T: false, S: false, A: true },
      trials: { T: false, S: false, A: true }
    },
    username: 'mervat',
    password: hashPassword('123123123'),
    mobile: '12313212323213'
  };
  await authRepository.create(body1);
  const body2 = {
    name: 'Arkan Branch',
    email: 'arkan@teppeti.me',
    branch: 'A',
    permissions: {
      sales: { T: false, S: false, A: false },
      products: { T: false, S: false, A: true },
      movingStock: { T: false, S: false, A: true },
      trials: { T: false, S: false, A: true }
    },
    username: 'arkan',
    password: hashPassword('123123123'),
    mobile: '12131312323213'
  };
  await authRepository.create(body2);
}

async function seedTagamo3(): Promise<void> {
  const body1 = {
    name: 'Nelly',
    email: 'nelly@teppeti.me',
    branch: 'T',
    permissions: {
      sales: { T: true, S: false, A: false },
      products: { T: true, S: false, A: false },
      movingStock: { T: true, S: false, A: false },
      trials: { T: true, S: false, A: false }
    },
    username: 'nelly',
    password: hashPassword('123123123'),
    mobile: '1231312232135'
  };
  await authRepository.create(body1);
  const body2 = {
    name: 'Downtown Tagamo3 Branch',
    email: 'downtown@teppeti.me',
    branch: 'T',
    permissions: {
      sales: { T: false, S: false, A: false },
      products: { T: true, S: false, A: true },
      movingStock: { T: true, S: false, A: true },
      trials: { T: true, S: false, A: true }
    },
    username: 'downtown',
    password: hashPassword('123123123'),
    mobile: '123134312323213'
  };
  await authRepository.create(body2);
}

async function seedSakara(): Promise<void> {
  const body = {
    name: 'Sakara Branch',
    email: 'sakara@teppeti.me',
    branch: 'S',
    permissions: {
      sales: { T: false, S: false, A: false },
      products: { T: false, S: true, A: false },
      movingStock: { T: false, S: true, A: false },
      trials: { T: false, S: true, A: false }
    },
    username: 'sakara',
    password: hashPassword('123123123'),
    mobile: '123131298323213'
  };
  await authRepository.create(body);
}

(async function seed(): Promise<void> {
  try {
    await startDB();
    await dropDB();
    await Promise.all([
      seedSuperAdmin(),
      seedArkan(),
      seedTagamo3(),
      seedSakara()
    ]);
    await stopDB();
  } catch (error) {
    console.log(error);
  }
})();
