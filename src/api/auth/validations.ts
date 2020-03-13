import { subYears } from 'date-fns';
import { Gender, Language } from '../../common/enums';
import joi from '../../lib/joi';

const REGISTER_USER = joi.object({
  firstName: joi
    .string()
    .trim()
    .required(),
  lastName: joi
    .string()
    .trim()
    .required(),
  email: joi
    .string()
    .trim()
    .email()
    .lowercase()
    .required(),
  username: joi
    .string()
    .trim()
    .lowercase()
    .required(),
  landline: joi.string().trim(),
  dob: joi
    .date()
    .max(subYears(new Date(), 10))
    .required(),
  city: joi
    .string()
    .trim()
    .required(),
  referrer: joi.string().trim(),
  gender: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(Gender))
    .required(),
  password: joi
    .string()
    .trim()
    .min(8)
    .required(),
  confirmPassword: joi
    .string()
    .trim()
    .min(8)
    .equal(joi.ref('password'))
    .required(),
  clientLanguage: joi
    .string()
    .trim()
    .lowercase()
    .valid(...Object.values(Language))
    .required(),
  facebookId: joi.string().trim(),
  facebookToken: joi.string().trim(),
  googleId: joi.string().trim(),
  googleToken: joi.string().trim()
});

const REFRESH_TOKEN = joi.object({
  refreshToken: joi
    .string()
    .trim()
    .required()
});

const RESEND_VERIFICATION = joi.object({
  mobile: joi
    .string()
    .trim()
    .min(8)
    .lowercase()
    .required()
});

const VERIFY_EMAIL = joi.object({
  emailVerificationToken: joi
    .string()
    .trim()
    .required()
});

const FORGOT_PASSWORD = joi.object({
  mobile: joi
    .string()
    .trim()
    .min(8)
    .required()
});

const RESET_PASSWORD = joi.object({
  password: joi
    .string()
    .trim()
    .min(8)
    .required(),
  confirmPassword: joi
    .string()
    .trim()
    .min(8)
    .equal(joi.ref('password'))
    .required(),
  resetPasswordToken: joi
    .string()
    .trim()
    .required()
});

const CHANGE_PASSWORD = joi.object({
  currentPassword: joi
    .string()
    .trim()
    .required(),
  password: joi
    .string()
    .trim()
    .disallow(joi.ref('currentPassword'))
    .required(),
  confirmPassword: joi
    .string()
    .trim()
    .equal(joi.ref('password'))
    .required()
});

const LOGIN = joi.object({
  username: joi
    .string()
    .trim()
    .lowercase()
    .required(),
  password: joi
    .string()
    .trim()
    .min(8)
    .required()
});

const REGISTER_MOBILE = joi.object({
  mobile: joi
    .string()
    .trim()
    .min(8)
    .required()
});

export {
  REGISTER_USER,
  REGISTER_MOBILE,
  RESEND_VERIFICATION,
  VERIFY_EMAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
  LOGIN,
  REFRESH_TOKEN
};
