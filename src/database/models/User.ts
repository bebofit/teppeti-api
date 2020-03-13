import { Document, model, Schema } from 'mongoose';
import { Language } from '../../common/enums';

interface IRefreshToken {
  id: string;
  createdAt?: Date;
  expiresAt: Date;
}

interface IPermission {
  sales: { T: boolean; S: boolean; A: boolean };
  products: { T: boolean; S: boolean; A: boolean };
  movingStock: { T: boolean; S: boolean; A: boolean };
  trials: { T: boolean; S: boolean; A: boolean };
}

type IAuthUserType = 'User' | 'Company';

interface IUser extends Document {
  _id: string;
  type: IAuthUserType;
  isSuperAdmin: boolean;
  permissions: IPermission;
  mobile: string;
  name: string;
  username: string;
  email?: string;
  dob?: Date;
  city?: string;
  clientLanguage?: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  refreshTokens: IRefreshToken[];
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  deletedAt?: Date;
}

const refreshTokenSchema = new Schema(
  {
    id: { type: String, required: true },
    device: new Schema(
      {
        id: { type: String, required: true },
        token: { type: String, required: true },
        model: String,
        manufacturer: String,
        platform: String,
        osVersion: String,
        appVersion: String
      },
      { _id: false, id: false }
    ),
    createdAt: Date,
    expiresAt: Date
  },
  { _id: false, id: false }
);

const userSchema = new Schema(
  {
    name: String,
    email: String,
    isSuperAdmin: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['T', 'S', 'A', 'SA'],
      required: true
    },
    permissions: {
      type: new Schema(
        {
          sales: { T: Boolean, S: Boolean, A: Boolean },
          products: { T: Boolean, S: Boolean, A: Boolean },
          movingStock: { T: Boolean, S: Boolean, A: Boolean },
          trials: { T: Boolean, S: Boolean, A: Boolean }
        },
        { _id: false, id: false }
      ),
      required: true
    },
    username: String,
    password: String,
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    city: String,
    clientLanguage: {
      type: String,
      enum: Object.values(Language)
    },
    lastLoginAt: Date,
    deletedAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    refreshTokens: [refreshTokenSchema],
    lock: String
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
    useNestedStrict: true
  }
);

userSchema.index({
  name: 'text',
  email: 'text'
});

// tslint:disable-next-line: variable-name
const User = model<IUser>('User', userSchema);

export { User, IUser, IAuthUserType, IRefreshToken, IPermission };
