import { Branch } from '../../common/enums';
import joi from '../../lib/joi';

const CREATE_SUPER_ADMIN = joi.object({
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
  client: joi.objectId().required()
});

const CREATE = joi.object({
  sentCarpets: joi
    .array()
    .items(joi.objectId())
    .required(),
  deliveryDate: joi
    .date()
    .min('now')
    .required(),
  client: joi.objectId().required()
});

const UPDATE = joi.object({
  sentCarpets: joi.array().items(joi.objectId()),
  deliveryDate: joi.date().min('now'),
  client: joi.object({
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

export {
  CREATE_SUPER_ADMIN,
  CREATE,
  UPDATE,
  ACCEPT_TRIAL,
  ACCEPT_TRIAL_SUPER_ADMIN
};
