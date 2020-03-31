import { Document, model, Schema } from 'mongoose';
import { ClientRef } from '../../common/enums';

type IClientRef =
  | 'Walk In'
  | 'Interior Design'
  | 'Friend'
  | 'Social Media'
  | 'Other';

interface IClient extends Document {
  id: string;
  reference: IClientRef;
  name: string;
  address: string;
  phoneNumber: string;
}

const clientSchema = new Schema(
  {
    reference: { type: String, required: true, enum: Object.values(ClientRef) },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
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
        delete ret.isLocked;
      }
    }
  }
);

// tslint:disable-next-line: variable-name
const Client = model<IClient>('Client', clientSchema);

export { Client, IClient };
