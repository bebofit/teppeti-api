import joi from '@hapi/joi';
// @ts-ignore
import joiObjectId from 'joi-objectid';

declare module '@hapi/joi' {
  interface Root {
    objectId: any;
  }
}

joi.objectId = joiObjectId(joi);

export default joi;
