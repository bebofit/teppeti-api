import joi from '../../lib/joi';
import { ClientRef } from '../../common/enums';

const CREATE_CLIENT = joi.object({
  reference: joi.object({
    type: joi
      .string()
      .trim()
      .valid(...Object.values(ClientRef))
      .required(),
    who: joi.string().trim()
  }),
  name: joi
    .string()
    .trim()
    .required(),
  address: joi
    .string()
    .trim()
    .required(),
  phoneNumber: joi
    .string()
    .trim()
    .required()
});

const UPDATE_CLIENT = joi.object({
  reference: joi.object({
    type: joi
      .string()
      .trim()
      .valid(...Object.values(ClientRef)),
    who: joi.string().trim()
  }),
  name: joi.string().trim(),
  address: joi.string().trim(),
  phoneNumber: joi.string().trim()
});

export { CREATE_CLIENT, UPDATE_CLIENT };
