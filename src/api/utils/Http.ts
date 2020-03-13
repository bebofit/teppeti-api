import { Response } from 'express';
import * as httpStatus from 'http-status';

class Http {
  sendResponse(
    response: Response,
    status: number,
    data: any,
    message: string
  ): any {
    response.status(status).json({
      data,
      message
    });
  }
}

export default new Http();
