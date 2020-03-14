import { Document, model, Schema } from 'mongoose';
import {
  CarpetSupplier,
  CarpetMaterial,
  CarpetType,
  Branch
} from '../../common/enums';

type ICarpetSupplier =
  | 'Bhadhoi'
  | 'Jaipur'
  | 'Rashed Carpets'
  | "Palace de l' Orient"
  | 'Orient Palace'
  | 'Rug Overseas'
  | 'Global'
  | 'Rajput';

type ICarpetMaterial =
  | 'Wool'
  | 'Wool & Silk'
  | 'Wool & Bamboo Silk'
  | 'Wool & Sari Silk'
  | 'Wool & Viscose';

type ICarpetType = 'Classic' | 'Contemporary' | 'Modern' | 'Handloom';

interface ICarpet extends Document {
  id: string;
  code: string;
  imageUrl: string;
  size: number;
  supplier: ICarpetSupplier;
  material: ICarpetMaterial;
  type: ICarpetType;
  price: number;
  pricePerSquareMeter: number;
}

const carpetSchema = new Schema(
  {
    code: { type: String, required: true },
    size: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
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
    pricePerSquareMeter: { type: Number, required: true },
    price: Number,
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

carpetSchema.index({ code: 1 });
carpetSchema.index({
  supplier: 'text',
  material: 'text',
  type: 'text'
});

// tslint:disable-next-line: variable-name
const Carpet = model<ICarpet>('Carpet', carpetSchema);

export { Carpet, ICarpet, ICarpetSupplier };
