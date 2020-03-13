import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { AuthUser, IAuthUser, IRefreshToken } from '../../database/models';

class AuthUserRepository extends BaseDBRepository<IAuthUser> {
  constructor(protected model: Model<IAuthUser>) {
    super(model);
  }

  findByEmail(email: string, options?: IDBQueryOptions): IDBQuery<IAuthUser> {
    return super.findOne({ email }, options);
  }

  findByMobile(mobile: string, options?: IDBQueryOptions): IDBQuery<IAuthUser> {
    return super.findOne({ mobile }, options);
  }

  updateEmailVerificationToken(
    email: string,
    emailVerificationToken: string,
    emailVerificationTokenExpiry: Date,
    options?: IDBQueryOptions
  ): IDBQuery<IAuthUser> {
    return super.findOneAndUpdate(
      { email, emailVerified: false },
      { emailVerificationToken, emailVerificationTokenExpiry },
      options
    );
  }

  changeEmail(
    id: string,
    email: string,
    emailVerificationToken: string,
    emailVerificationTokenExpiry: Date,
    options?: IDBQueryOptions
  ): IDBQuery<IAuthUser> {
    return super.findByIdAndUpdate(
      id,
      {
        email,
        emailVerificationToken,
        emailVerificationTokenExpiry,
        emailVerified: false
      },
      options
    );
  }

  verifyEmail(
    emailVerificationToken: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateOne(
      {
        emailVerificationToken,
        emailVerificationTokenExpiry: { $gte: new Date() }
      },
      {
        emailVerified: true,
        accountVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null
      },
      options
    );
  }

  updateResetPasswordToken(
    email: string,
    resetPasswordToken: string,
    resetPasswordTokenExpiry: Date,
    options?: IDBQueryOptions
  ): IDBQuery<IAuthUser> {
    return super.findOneAndUpdate(
      { email },
      { resetPasswordToken, resetPasswordTokenExpiry },
      options
    );
  }

  resetPassword(
    resetPasswordToken: string,
    password: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateOne(
      {
        resetPasswordToken,
        resetPasswordTokenExpiry: { $gte: new Date() }
      },
      {
        password,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null
      },
      options
    );
  }

  updatePassword(
    userId: string,
    password: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateById(
      userId,
      {
        password
      },
      options
    );
  }

  updateLastLoginAt(
    userId: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateById(
      userId,
      {
        lastLoginAt: new Date()
      },
      options
    );
  }

  updateProfilePicture(
    userId: string,
    body: any,
    options?: IDBQueryOptions
  ): IDBQuery<IAuthUser> {
    return super.findByIdAndUpdate(userId, { profilePicture: body }, options);
  }

  addRefreshToken(
    userId: string,
    token: IRefreshToken,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.flexibleUpdateById(
      userId,
      {
        $push: {
          refreshTokens: {
            $each: [token],
            $sort: { expiresAt: 1 },
            $slice: -10
          }
        },
        lastLoginAt: new Date()
      },
      options
    );
  }

  deleteRefreshToken(
    userId: string,
    tokenId: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.flexibleUpdateOne(
      { _id: userId },
      { $pull: { refreshTokens: { id: tokenId } }, lastLoginAt: new Date() },
      options
    );
  }

  revokeOtherRefreshTokens(
    userId: string,
    tokenId: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.flexibleUpdateOne(
      { _id: userId },
      {
        $pull: { refreshTokens: { id: { $ne: tokenId } } },
        lastLoginAt: new Date()
      },
      options
    );
  }

  revokeRefreshTokens(
    resetPasswordToken: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.flexibleUpdateOne(
      { resetPasswordToken },
      { refreshTokens: [], lastLoginAt: new Date() },
      options
    );
  }
}

const authUserRepository = new AuthUserRepository(AuthUser);

export default authUserRepository;
