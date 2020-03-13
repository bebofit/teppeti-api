import { IConfig } from '../common/types';
import { isNumber } from '../common/utils';

const config = {} as IConfig;

Object.keys(process.env).forEach(key => {
  const str = process.env[key];
  const num = Number(str);
  (config as any)[key] = isNumber(num) ? num : str;
});

export default config;
export * from './environment';
