import { Branch } from '../../common/enums';
import joi from '../../lib/joi';

const CREATE = joi.object({
  sentCarpets: joi
    .array()
    .items(joi.objectId())
    .required(),
  sender: joi
    .string()
    .trim()
    .valid(...Object.values(Branch))
    .required(),
  deliveryDate: joi
    .date()
    .min('now')
    .required(),
  contact: joi.object({
    name: joi
      .string()
      .trim()
      .required(),
    address: joi
      .string()
      .trim()
      .required(),
    mobile: joi
      .string()
      .trim()
      .required()
  })
});

const UPDATE = joi.object({
  sentCarpets: joi.array().items(joi.objectId()),
  deliveryDate: joi.date().min('now'),
  contact: joi.object({
    name: joi.string().trim(),
    address: joi.string().trim(),
    mobile: joi.string().trim()
  })
});

const ACCEPT_TRIAL_SUPER_ADMIN = joi.object({
  soldCarpets: joi
    .array()
    .items({
      id: joi.objectId().required(),
      finalPricePerSquareMeter: joi.number().required()
    })
    .required(),
  sender: joi
    .string()
    .trim()
    .valid(...Object.values(Branch))
    .required()
});

const ACCEPT_TRIAL = joi.object({
  soldCarpets: joi
    .array()
    .items(joi.objectId())
    .required()
});

export { CREATE, UPDATE, ACCEPT_TRIAL, ACCEPT_TRIAL_SUPER_ADMIN };