import { Types } from 'mongoose';
import { Language } from '../enums';
import { IRequest } from '../types';

function mapEnumToObject<K extends string | number | symbol, T>(
  e: any,
  valueMapper: (key: K) => T
): Record<K, T> {
  return Object.values<K>(e).reduce<Record<K, T>>(
    (output: any, key: K) => ({
      ...output,
      [key]: valueMapper(key)
    }),
    {} as any
  );
}

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const getBrowserLanguage = (req: IRequest) =>
  (req.acceptsLanguages(Object.values(Language)) || Language.English)
    .split('-')[0]
    .toLowerCase();

const genObjectId = (): Types.ObjectId => Types.ObjectId();

export { mapEnumToObject, delay, getBrowserLanguage, genObjectId };
