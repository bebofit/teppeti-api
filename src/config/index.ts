import { IConfig } from '../common/types';

const config = {} as IConfig;

Object.keys(process.env).forEach(key => {
  const str = process.env[key];
  const num = Number(str);
  (config as any)[key] = Number.isNaN(num) ? str : num;
});

export default config;
export * from './environment';
