import cron from 'cron';
import * as salesService from '../api/sales/service';
import { Branch } from '../common/enums';

const cronJob = cron.CronJob;

// '0 0 0 * * ?'
const salesJob = new cronJob('0 0 */1 * *', () => {
  const date = new Date();
  Object.values(Branch).map(async branch => {
    await salesService.createSale(0, date, branch);
  });
});

export { salesJob };
