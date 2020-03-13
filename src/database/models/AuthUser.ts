import { Document, model, Schema } from 'mongoose';
import { Gender, Language } from '../../common/enums';

interface IDevice {
  id: string;
  model: string;
  platform: string;
  osVersion: string;
  appVersion: string;
}

interface IRefreshToken {
  id: string;
  device?: IDevice;
  createdAt?: Date;
  expiresAt: Date;
}

type IAuthUserType = 'User' | 'Company';

type IAuthUserGender = 'M' | 'F';

interface IAuthUser extends Document {
  _id: string;
  type: IAuthUserType;
  accountVerified: boolean;
  phoneVerified: boolean;
  mobile: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  dob?: Date;
  city?: string;
  referrer?: string;
  gender?: IAuthUserGender;
  clientLanguage?: string;
  password?: string;
  landline?: string;
  facebookId?: string;
  facebookToken?: string;
  googleId?: string;
  googleToken?: string;
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

const authUserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    landline: String,
    dob: Date,
    city: String,
    referrer: String,
    gender: {
      type: String,
      enum: Object.values(Gender)
    },
    clientLanguage: {
      type: String,
      enum: Object.values(Language)
    },
    facebookId: String,
    facebookToken: String,
    googleId: String,
    googleToken: String,
    lastLoginAt: Date,
    deletedAt: Date,
    phoneVerified: { type: Boolean, default: false },
    accountVerified: { type: Boolean, default: false },
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

authUserSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phoneNumber: 'text'
});

// tslint:disable-next-line: variable-name
const AuthUser = model<IAuthUser>('AuthUser', authUserSchema);

export {
  AuthUser,
  IAuthUser,
  IAuthUserType,
  IAuthUserGender,
  IRefreshToken,
  IDevice
};
