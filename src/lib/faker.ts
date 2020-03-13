import faker from 'faker';
import { Types } from 'mongoose';

faker.seed(32955537283290832109334431323284344);

interface Faker extends Faker.FakerStatic {
  objectId: () => Types.ObjectId;
}

const customFaker = faker as Faker;

customFaker.objectId = () => Types.ObjectId();

export default customFaker;
