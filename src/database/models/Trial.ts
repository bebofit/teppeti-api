import { Document, model, Schema } from 'mongoose';
import { Branch, MovingStockStatus } from '../../common/enums';
import { ICarpet } from './Carpet';

type IBranch = 'T' | 'S' | 'A';

type IStatus = 0 | 1;

interface ITrial extends Document {
  id: string;
  sentCarpets: string[] | ICarpet[];
  soldCarpets: string[] | ICarpet[];
  deliveryDate: Date;
  contact: {
    name: string;
    address: string;
    mobile: string;
  }
  status: IStatus;
  sender: IBranch;
}

const trialSchema = new Schema({
  sentCarpets: [
    {
      type: String,
      ref: 'Carpet',
      required: true
    }
  ],
  soldCarpets: [
    {
      type: String,
      ref: 'Carpet'
    }
  ],
  deliveryDate: {
    type: Date,
    required: true
  },
  contact: {
    type: new Schema({
      name: { type: String, required: true },
      address: { type: String, required: true },
      mobile: { type: String, required: true }
    }),
    required: true
  },
  sender: { type: String, required: true, enum: Object.values(Branch) }
});

// tslint:disable-next-line: variable-name
const Trial = model<ITrial>('Trial', trialSchema);

export { Trial, ITrial };
