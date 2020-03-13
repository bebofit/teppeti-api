import { Schema } from 'mongoose';
import { AccountType } from '../../common/enums';
import { AuthUser, IAuthUser } from './AuthUser';

interface IUser extends IAuthUser {
  type: AccountType.User;
  likes: string[];
}

const userSchema = new Schema({
  likes: [String]
});

// tslint:disable-next-line: variable-name
const User = AuthUser.discriminator<IUser>('User', userSchema);

export { User, IUser };
