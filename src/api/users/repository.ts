import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IUser, User } from '../../database/models';

class UserRepository extends BaseDBRepository<IUser> {
  constructor(protected model: Model<IUser>) {
    super(model);
  }
}

export default new UserRepository(User);
