import dotenv from 'dotenv';
dotenv.config();
import authRepository from '../src/api/auth/repository';
import {
  Branch,
  CarpetMaterial,
  CarpetSupplier,
  CarpetType,
  ClientRef
} from '../src/common/enums';
import { CarpetLocation } from '../src/common/enums/CarpetLocation';
import { hashPassword } from '../src/common/utils';
import { dropDB, startDB, stopDB } from '../src/database';
import faker from '../src/lib/faker';
import * as carpetsService from '../src/api/carpets/service';
import * as clientsService from '../src/api/clients/service';
import * as salesService from '../src/api/sales/service';
import { addDays } from 'date-fns';

const SALES_COUNT = 30;

let soldCarpets: any = [];
let clients: any = [];

async function seedSuperAdmin(): Promise<void> {
  const body = {
    name: 'Abo Mervat',
    email: 'superadmin@teppeti.me',
    isSuperAdmin: true,
    isSalesManager: true,
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
    isSalesManager: true,
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
    isSalesManager: true,
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
async function seedCarpets(): Promise<void> {
  await Promise.all(
    Array(20)
      .fill(null)
      .map(() =>
        carpetsService.createCarpet({
          code: Math.floor(Math.random() * 10000).toString(),
          width: faker.random.number(20),
          length: faker.random.number(20),
          supplier: faker.random.arrayElement(Object.values(CarpetSupplier)),
          material: faker.random.arrayElement(Object.values(CarpetMaterial)),
          type: faker.random.arrayElement(Object.values(CarpetType)),
          branch: faker.random.arrayElement(Object.values(Branch)),
          pricePerSquareMeter: faker.random.number(200),
          location: faker.random.arrayElement(Object.values(CarpetLocation))
        })
      )
  );
}

async function seedSoldCarpets(): Promise<void> {
  soldCarpets = await Promise.all(
    Array(SALES_COUNT)
      .fill(null)
      .map(() =>
        carpetsService.createCarpet({
          code: Math.floor(Math.random() * 10000).toString(),
          width: faker.random.number(20),
          length: faker.random.number(20),
          supplier: faker.random.arrayElement(Object.values(CarpetSupplier)),
          material: faker.random.arrayElement(Object.values(CarpetMaterial)),
          type: faker.random.arrayElement(Object.values(CarpetType)),
          branch: faker.random.arrayElement(Object.values(Branch)),
          pricePerSquareMeter: faker.random.number(200),
          location: faker.random.arrayElement(Object.values(CarpetLocation)),
          isSold: true,
          price: faker.random.number(500),
          finalPricePerSquareMeter: faker.random.number(200),
          client: faker.random.arrayElement(clients)
        })
      )
  );
}

async function seedClients(): Promise<void> {
  clients = await Promise.all(
    Array(10)
      .fill(null)
      .map(() =>
        clientsService.createClient({
          name: faker.name.firstName(),
          phoneNumber: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          reference: faker.random.arrayElement(Object.values(ClientRef))
        })
      )
  );
}

async function seedSales(): Promise<void> {
  await Promise.all(
    Array(SALES_COUNT)
      .fill(null)
      .map((v, i) =>
        salesService.createSale(
          soldCarpets[i].price,
          addDays(new Date(), faker.random.number(5)),
          soldCarpets[i].branch,
          soldCarpets[i]
        )
      )
  );
}

(async function seed(): Promise<void> {
  try {
    await startDB();
    await dropDB();
    await Promise.all([
      seedSuperAdmin(),
      seedArkan(),
      seedTagamo3(),
      seedSakara(),
      seedCarpets(),
      seedClients()
    ]);
    await seedSoldCarpets();
    await seedSales();
    await stopDB();
  } catch (error) {
    console.log(error);
  }
})();
