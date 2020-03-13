import joi from '../../lib/joi';

const REFRESH_TOKEN = joi.object({
  refreshToken: joi
    .string()
    .trim()
    .required()
});

const RESEND_VERIFICATION = joi.object({
  email: joi
    .string()
    .email()
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
  email: joi
    .string()
    .email()
    .trim()
    .min(8)
    .lowercase()
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

export {
  RESEND_VERIFICATION,
  VERIFY_EMAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
  LOGIN,
  REFRESH_TOKEN
};
