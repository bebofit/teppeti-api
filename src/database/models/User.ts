import { Document, model, Schema } from 'mongoose';
import { Language, UserType } from '../../common/enums';

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

interface IUser extends Document {
  _id: string;
  isSuperAdmin: boolean;
  isSalesManager: boolean;
  permissions: IPermission;
  mobile: string;
  name: string;
  username: string;
  branch: UserType;
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
    isSalesManager: { type: Boolean, default: false },
    branch: {
      type: String,
      enum: Object.values(UserType),
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
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.lastLoginAt;
        delete ret.deletedAt;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationTokenExpiry;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordTokenExpiry;
        delete ret.refreshTokens;
        delete ret.password;
        delete ret.lock;
        delete ret.__v;
      }
    }
  }
);

userSchema.index({
  name: 'text',
  email: 'text'
});

// tslint:disable-next-line: variable-name
const User = model<IUser>('User', userSchema);

export { User, IUser, IRefreshToken, IPermission };
