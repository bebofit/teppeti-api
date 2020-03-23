import { Response } from 'express';
import { IRequest } from '../../common/types';
import * as movingStockValidations from './validations';
import * as movingStocksService from './service';
import {
  validateBody,
  extractPaginationOptions,
  validateDBId
} from '../../common/utils';
import {
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  NOT_FOUND,
  NO_CONTENT
} from 'http-status';
import { MovingStockStatus } from '../../common/enums';
import { IMovingStock } from '../../database/models';

async function getMovingStocksBySender(
  req: IRequest,
  res: Response
): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const { isSuperAdmin, branch } = req.authInfo;
  const sender = isSuperAdmin ? req.query.sender : branch;
  const movingStocks = await movingStocksService.getMovingStocksBySender(
    sender,
    paginationOptions
  );
  res.status(OK).json({
    data: movingStocks.filter(
      (m: IMovingStock) => m.status === MovingStockStatus.Sent
    )
  });
}

async function getMovingStocksByReceiver(
  req: IRequest,
  res: Response
): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const { isSuperAdmin, branch } = req.authInfo;
  const receiver = isSuperAdmin ? req.query.receiver : branch;
  const movingStocks = await movingStocksService.getMovingStocksByReceiver(
    receiver,
    paginationOptions
  );
  res.status(OK).json({
    data: movingStocks.filter(
      (m: IMovingStock) => m.status === MovingStockStatus.Received
    )
  });
}

async function getMovingStockById(req: IRequest, res: Response): Promise<any> {
  const movingStockId = req.params.movingStockId;
  validateDBId(req.params.movingStockId);
  const movingStock = await movingStocksService.getMovingStockById(
    movingStockId
  );
  if (!movingStock) {
    throw {
      statusCode: NOT_FOUND,
      errorCode: 'Cannot find Moving Stock'
    };
  }
  res.status(OK).json({
    data: movingStock
  });
}

async function createMovingStock(req: IRequest, res: Response): Promise<any> {
  let body: any = {};
  const { isSuperAdmin, branch } = req.authInfo;
  if (!isSuperAdmin) {
    body = validateBody(req.body, movingStockValidations.CREATE);
    body.sender = branch;
  } else {
    body = validateBody(req.body, movingStockValidations.CREATE_SUPER_ADMIN);
  }
  const movingStock = await movingStocksService.createMovingStock(body);
  if (!movingStock) {
    throw {
      statusCode: INTERNAL_SERVER_ERROR,
      errorCode: 'Cannot create Moving Stock'
    };
  }
  res.status(CREATED).json({
    data: movingStock
  });
}

async function acceptMovingStock(req: IRequest, res: Response): Promise<any> {
  const movingStockId = req.params.movingStockId;
  validateDBId(req.params.movingStockId);
  const { isSuperAdmin, branch } = req.authInfo;
  let body: any = {};
  if (!isSuperAdmin) {
    body = validateBody(req.body, movingStockValidations.MOVE_STOCK);
    body.receiver = branch;
  } else {
    body = validateBody(
      req.body,
      movingStockValidations.MOVE_STOCK_SUPER_ADMIN
    );
  }
  const isUpdated = await movingStocksService.acceptMovingStock(
    movingStockId,
    body
  );

  if (!isUpdated) {
    throw { statusCode: INTERNAL_SERVER_ERROR };
  }
}

async function softDeleteMovingStock(
  req: IRequest,
  res: Response
): Promise<any> {
  const movingStockId = req.params.movingStockId;
  validateDBId(req.params.movingStockId);
  const isDeleted = await movingStocksService.softDeleteMovingStock(
    movingStockId
  );
  if (!isDeleted) {
    throw { statusCode: INTERNAL_SERVER_ERROR };
  }
  res.status(NO_CONTENT).send();
}

export {
  createMovingStock,
  getMovingStocksBySender,
  getMovingStocksByReceiver,
  getMovingStockById,
  acceptMovingStock,
  softDeleteMovingStock
};
