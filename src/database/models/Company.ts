import { Schema } from 'mongoose';
import { AccountType } from '../../common/enums';
import { AuthUser, IAuthUser } from './AuthUser';

interface ICompany extends IAuthUser {
  type: AccountType.Company;
  company: {
    name: string;
    nameAR?: string;
    description: string;
    address: string;
    email: string;
    phone: string;
    landline?: string;
    registrationName: string;
    registrationNumber: string;
  };
}

const companySchema = new Schema({
  company: {
    type: new Schema(
      {
        name: { type: String, required: true },
        nameAR: String,
        description: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        landline: String,
        registrationName: String,
        registrationNumber: String
      },
      { _id: false }
    ),
    required: true
  }
});

// tslint:disable-next-line: variable-name
const Company = AuthUser.discriminator<ICompany>('Company', companySchema);

export { Company, ICompany };
