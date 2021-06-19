import { DocumentQuery, Document } from 'mongoose';

export type IDBQuery<T extends Document> = DocumentQuery<any, T>;
