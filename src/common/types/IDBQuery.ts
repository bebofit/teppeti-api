import { DocumentQuery, Document, EnforceDocument } from 'mongoose';

export type IDBQuery<T extends Document> = EnforceDocument<any, T>;
