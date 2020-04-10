import { Document, model, Schema } from 'mongoose';
import { Branch } from '../../common/enums';
import { carpetSchema, ICarpet } from './Carpet';

type IBranch = 'T' | 'S' | 'A';

interface ISale extends Document {
  id: string;
  carpets: ICarpet[];
  branch: IBranch;
  totalAmount: number;
  date: Date;
}

const saleSchema = new Schema({
  carpets: [carpetSchema],
  branch: { type: String, enum: Object.values(Branch), required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, required: true }
});

// tslint:disable-next-line: variable-name
const Sale = model<ISale>('Sale', saleSchema);

export { Sale, ISale };
