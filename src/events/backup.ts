import cron from 'cron';
import * as salesService from '../api/sales/service';
import * as usersService from '../api/users/service';
import * as movingStockService from '../api/moving-stock/service';
import * as carpetsService from '../api/carpets/service';
import * as clientsService from '../api/clients/service';
import * as trialsService from '../api/trials/service';

import config from '../config';
import { uploadFile } from '../common/services/storage';

const { BACKUP_KEY } = config;

const cronJob = cron.CronJob;

// '0 0 0 * * ?'
// */1 * * * *  every minutes
// 0 0 */1 * * *  everyday at 12 am
const backupJob = new cronJob('0 0 */1 * *', async () => {
  console.log('WRITING IN FILE');

  const sales = await salesService.getAll(BACKUP_KEY);
  await uploadFile('sales', sales, BACKUP_KEY);

  const users = await usersService.getAll(BACKUP_KEY);
  await uploadFile('users', users, BACKUP_KEY);

  const movingStock = await movingStockService.getAll(BACKUP_KEY);
  await uploadFile('moving-stock', movingStock, BACKUP_KEY);

  const carpets = await carpetsService.getAll(BACKUP_KEY);
  await uploadFile('carpets', carpets, BACKUP_KEY);

  const clients = await clientsService.getAll(BACKUP_KEY);
  await uploadFile('clients', clients, BACKUP_KEY);

  const trials = await trialsService.getAll(BACKUP_KEY);
  await uploadFile('trials', trials, BACKUP_KEY);

  console.log('done');
});

export { backupJob };
