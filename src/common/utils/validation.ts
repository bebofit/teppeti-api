import { isValid } from 'date-fns';
import { Types } from 'mongoose';
import joi from '../../lib/joi';
import {
  BODY_VALIDATION,
  HEADERS_VALIDATION,
  PARAMS_VALIDATION
} from '../errors';

const { ObjectId } = Types;

const isString = (val: any): boolean => typeof val === 'string';

const isNumber = (val: any): boolean => !Number.isNaN(val);

const isBoolean = (val: any): boolean => val === true || val === false;

const isDate = (val: any): boolean => isValid(val);

const isObject = (val: any): boolean => typeof val === 'object';

const isObjectId = (val: any): boolean => ObjectId.isValid(val);

const isArray = (val: any): boolean => Array.isArray(val);

const matchesRegex = (val: any, regex: RegExp): boolean => regex.test(val);

function validateDBId(id: any): void {
  const isValid = isObjectId(id);
  if (!isValid) {
    throw {
      errorCode: PARAMS_VALIDATION,
      validationError: true
    };
  }
}

function validateESId(id: any): void {
  if (!(isString(id) && id.trim().length)) {
    throw {
      errorCode: PARAMS_VALIDATION,
      validationError: true
    };
  }
}

function validateDeviceId(id: any): void {
  if (!(isString(id) && id.trim().length)) {
    throw {
      errorCode: HEADERS_VALIDATION,
      validationError: true
    };
  }
}

function validateBody(body: any, schema: joi.Schema): any {
  const { error: joiErrors, value } = schema.validate(body, {
    stripUnknown: true,
    abortEarly: false
  });
  if (joiErrors) {
    const errors = joiErrors.details.reduce(
      (obj: Record<string, string>, error: joi.ValidationErrorItem) => {
        const key = error.path.join('.');
        obj[key] = `err_${error.type.split('.')[1]}`;
        return obj;
      },
      {}
    );
    throw {
      errors,
      errorCode: BODY_VALIDATION,
      validationError: true
    };
  }
  return value;
}

export {
  isString,
  isNumber,
  isBoolean,
  isDate,
  isObject,
  isArray,
  isObjectId,
  matchesRegex,
  validateDBId,
  validateBody,
  validateESId,
  validateDeviceId
};
