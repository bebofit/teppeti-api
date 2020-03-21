import { Document, model, Schema } from 'mongoose';
import { Branch, MovingStockStatus } from '../../common/enums';
import { ICarpet } from './Carpet';

type IBranch = 'T' | 'S' | 'A';

type IStatus = 0 | 1;

interface IMovingStock extends Document {
  id: string;
  sentCarpets: string[] | ICarpet[];
  receivedCarpets: string[] | ICarpet[];
  status: IStatus;
  sender: IBranch;
  receiver: IBranch;
}

const movingStockSchema = new Schema(
  {
    sentCarpets: [
      {
        type: String,
        ref: 'Carpet',
        required: true
      }
    ],
    receivedCarpets: [
      {
        type: String,
        ref: 'Carpet'
      }
    ],
    status: {
      type: Number,
      enum: Object.values(MovingStockStatus),
      default: MovingStockStatus.Sent
    },
    sender: { type: String, required: true, enum: Object.values(Branch) },
    receiver: { type: String, required: true, enum: Object.values(Branch) },
    deletedAt: Date,
    lock: String
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.deletedAt;
        delete ret.lock;
        delete ret.__v;
      }
    }
  }
);

// tslint:disable-next-line: variable-name
const MovingStock = model<IMovingStock>('MovingStock', movingStockSchema);

export { MovingStock, IMovingStock };
