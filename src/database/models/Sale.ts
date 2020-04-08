import { Document, model, Schema } from 'mongoose';
import {
  Branch,
  CarpetMaterial,
  CarpetSupplier,
  CarpetType
} from '../../common/enums';
import {
  ICarpet,
  ICarpetMaterial,
  ICarpetSupplier,
  ICarpetType
} from './Carpet';

type IBranch = 'T' | 'S' | 'A';

interface ISale extends Document {
  id: string;
  carpet: String | ICarpet;
  branch: IBranch;
  supplier: ICarpetSupplier;
  material: ICarpetMaterial;
  type: ICarpetType;
  price: number;
  date: Date;
}

const saleSchema = new Schema({
  carpet: { type: Schema.Types.ObjectId, ref: 'Carpet', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  supplier: {
    type: String,
    required: true,
    enum: Object.values(CarpetSupplier)
  },
  material: {
    type: String,
    required: true,
    enum: Object.values(CarpetMaterial)
  },
  type: { type: String, required: true, enum: Object.values(CarpetType) },
  branch: { type: String, required: true, enum: Object.values(Branch) },
  price: { type: Number, required: true },
  date: { type: Date, required: true }
});

// tslint:disable-next-line: variable-name
const Sale = model<ISale>('Sale', saleSchema);

export { Sale, ISale };
