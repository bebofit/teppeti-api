import { Document, model, Schema } from 'mongoose';
import {
  CarpetSupplier,
  CarpetMaterial,
  CarpetType,
  Branch
} from '../../common/enums';
import { CarpetLocation } from '../../common/enums/CarpetLocation';

type ICarpetSupplier =
  | 'Bhadhoi'
  | 'Jaipur'
  | 'Rashed Carpets'
  | "Palace de l' Orient"
  | 'Orient Palace'
  | 'Rug Overseas'
  | 'Global'
  | 'Rajput'
  | 'Other';

type ICarpetMaterial =
  | 'Wool'
  | 'Wool & Silk'
  | 'Silk'
  | 'Wool & Bamboo Silk'
  | 'Wool & Sari Silk'
  | 'Wool & Viscose';

type ICarpetType = 'Classic' | 'Contemporary' | 'Modern' | 'Handloom';

type IBranch = 'T' | 'S' | 'A';

interface IFileUpload extends Document {
  type: string;
  size: number;
  path: string;
  url: string;
}

interface ICarpet extends Document {
  id: string;
  code: string;
  photo?: IFileUpload;
  width: number;
  height: number;
  supplier: ICarpetSupplier;
  material: ICarpetMaterial;
  type: ICarpetType;
  branch: IBranch;
  price: number;
  pricePerSquareMeter: number;
  isLocked: boolean;
  isSold: boolean;
}

const fileUploadSchema = new Schema(
  {
    type: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true }
  },
  { _id: false, id: false }
);

const carpetSchema = new Schema(
  {
    code: { type: String, required: true },
    width: { type: Number, required: true },
    length: { type: Number, required: true },
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
    location: {
      type: String,
      enum: Object.values(CarpetLocation),
      default: CarpetLocation.Display
    },
    finalPricePerSquareMeter: Number,
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      default: null
    },
    photo: fileUploadSchema,
    isSold: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
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
        delete ret.isLocked;
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

export { Carpet, ICarpet, ICarpetSupplier, IFileUpload };
