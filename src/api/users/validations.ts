import { Gender } from '../../common/enums';
import joi from '../../lib/joi';

const CREATE = joi.object({
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
  phoneNumber: joi
    .string()
    .trim()
    .required(),
  landline: joi.string().trim(),
  dob: joi.date().required(),
  country: joi
    .string()
    .trim()
    .required(),
  city: joi
    .string()
    .trim()
    .required(),
  nationality: joi
    .string()
    .trim()
    .required(),
  referrer: joi.string().trim(),
  gender: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(Gender))
    .required()
});

const UPDATE = joi.object({
  firstName: joi.string().trim(),
  lastName: joi.string().trim(),
  email: joi
    .string()
    .trim()
    .email()
    .lowercase(),
  password: joi.string().trim(),
  phoneNumber: joi.string().trim(),
  landline: joi.string().trim(),
  dob: joi.date(),
  country: joi.string().trim(),
  city: joi.string().trim(),
  nationality: joi.string().trim(),
  referrer: joi.string().trim(),
  gender: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(Gender)),
  facebookId: joi.string().trim(),
  facebookToken: joi.string().trim(),
  googleId: joi.string().trim(),
  googleToken: joi.string().trim(),
  favorites: joi.array().items(joi.objectId()),
  notes: joi.array().items(
    joi.object({
      property: joi.objectId(),
      comment: joi.string().trim()
    })
  )
});

export { CREATE, UPDATE };
