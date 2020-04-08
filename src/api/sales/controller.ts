// import { format, set } from 'date-fns';
import { Response } from 'express';
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  NO_CONTENT,
  OK
} from 'http-status';
import { IRequest } from '../../common/types';
import { validateBody, validateDBId } from '../../common/utils';
import * as salesService from './service';
import * as saleValidations from './validations';

async function getAnalytics(req: IRequest, res: Response): Promise<any> {
  const { min, max } = validateBody(req.query, saleValidations.GET_SALES);
  const [sales, clients] = await salesService.getAnalytics(min, max);
  res.status(OK).json({ sales, clients });
}

async function getSaleById(req: IRequest, res: Response): Promise<any> {
  const saleId = req.params.saleId;
  validateDBId(req.params.saleId);
  const sale = await salesService.getSaleById(saleId);
  if (!sale) {
    throw {
      statusCode: NOT_FOUND,
      errorCode: 'Cannot find Sale'
    };
  }
  res.status(OK).json({
    data: sale
  });
}

async function createSale(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, saleValidations.CREATE);
  body.date = new Date();
  const sale = await salesService.createSale(body);
  if (!sale) {
    throw {
      statusCode: INTERNAL_SERVER_ERROR,
      errorCode: 'Cannot create Sale'
    };
  }
  res.status(CREATED).json();
}

async function updateSale(req: IRequest, res: Response): Promise<any> {
  const saleId = req.params.saleId;
  validateDBId(req.params.saleId);
  const body = validateBody(req.body, saleValidations.UPDATE);
  const sale = await salesService.updateSale(saleId, body);
  if (!sale) {
    throw {
      statusCode: NOT_FOUND,
      errorCode: 'Cannot find Sale'
    };
  }
  res.status(OK).json({
    data: sale
  });
}

async function softDeleteSale(req: IRequest, res: Response): Promise<any> {
  const saleId = req.params.saleId;
  validateDBId(req.params.saleId);
  const isDeleted = await salesService.softDeleteSale(saleId);
  if (!isDeleted) {
    throw { statusCode: INTERNAL_SERVER_ERROR };
  }
  res.status(NO_CONTENT).send();
}

export { createSale, getAnalytics, getSaleById, updateSale, softDeleteSale };