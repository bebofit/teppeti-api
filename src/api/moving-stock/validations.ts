import joi from '../../lib/joi';
import { Branch } from '../../common/enums';

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
  receiver: joi
    .string()
    .trim()
    .valid(...Object.values(Branch))
    .required()
});

const MOVE_STOCK = joi.object({
  receivedCarpets: joi
    .array()
    .items(joi.objectId())
    .required(),
  receiver: joi
    .string()
    .trim()
    .valid(...Object.values(Branch))
    .required()
});
export { CREATE, MOVE_STOCK };
