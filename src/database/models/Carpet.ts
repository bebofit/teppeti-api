import { Document, model, Schema } from 'mongoose';
import {
  CarpetSupplier,
  CarpetMaterial,
  CarpetType,
  Branch,
  CarpetKnot,
  CarpetColor
} from '../../common/enums';
import { CarpetLocation } from '../../common/enums/CarpetLocation';
import { IClient } from './Client';
import { generateId } from '../../common/utils';

type ICarpetColor =
  | 'Green'
  | 'Yellow'
  | 'Purple'
  | 'Pink'
  | 'Orange'
  | 'Gold'
  | 'Silver'
  | 'Offwhite'
  | 'Black'
  | 'Brown'
  | 'Beige'
  | 'Red'
  | 'Blue'
  | 'Grey';

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

type ICarpetKnot = 'Lebanese' | 'Handloom' | 'Persian';

interface IFileUpload extends Document {
  type: string;
  size: number;
  path: string;
  url: string;
}

interface ICarpet extends Document {
  id: string;
  code: string;
  width: number;
  length: number;
  supplier: ICarpetSupplier;
  material: ICarpetMaterial;
  type: ICarpetType;
  knot: ICarpetKnot;
  branch: IBranch;
  pricePerSquareMeter: number;
  isLocked: boolean;
  isSold: boolean;
  client?: string | IClient;
  photo?: IFileUpload;
  price?: number;
  finalPricePerSquareMeter?: number;
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
    code: { type: String, default: () => generateId() },
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
    knot: { type: String, required: true, enum: Object.values(CarpetKnot) },
    color: {
      primary: [
        {
          type: String,
          required: true,
          enum: Object.values(CarpetColor)
        }
      ],
      secondary: String
    },
    finalPricePerSquareMeter: Number,
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      default: null
    },
    photo: {
      type: fileUploadSchema,
      default: () => ({
        type: 'Image',
        size: '30',
        path: 'misc/logo.jpg',
        url: 'https://tappeti-001.s3.us-east-2.amazonaws.com/misc/logo.jpg'
      })
    },
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
        delete ret.isSold;
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

export {
  Carpet,
  carpetSchema,
  ICarpet,
  ICarpetSupplier,
  ICarpetMaterial,
  ICarpetType,
  IFileUpload,
  IBranch
};
