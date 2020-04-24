import { Response } from 'express';
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  NO_CONTENT,
  OK
} from 'http-status';
import { IRequest } from '../../common/types';
import {
  extractPaginationOptions,
  validateBody,
  validateDBId
} from '../../common/utils';
import { startTransaction } from '../../database';
import * as movingStocksService from './service';
import * as carpetsService from '../carpets/service';
import * as movingStockValidations from './validations';

async function getMovingStocksBySender(
  req: IRequest,
  res: Response
): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const { isSuperAdmin, branch } = req.authInfo;
  const sender = isSuperAdmin ? req.query.branch : branch;
  const movingStocks = await movingStocksService.getMovingStocksBySender(
    sender,
    paginationOptions
  );
  res.status(OK).json({
    data: movingStocks
  });
}

async function getMovingStocksByReceiver(
  req: IRequest,
  res: Response
): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const { isSuperAdmin, branch } = req.authInfo;
  const receiver = isSuperAdmin ? req.query.branch : branch;
  const movingStocks = await movingStocksService.getMovingStocksByReceiver(
    receiver,
    paginationOptions
  );
  res.status(OK).json({
    data: movingStocks
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
  let movingStock: any;
  const { isSuperAdmin, branch } = req.authInfo;
  if (!isSuperAdmin) {
    body = validateBody(req.body, movingStockValidations.CREATE);
    body.sender = branch;
  } else {
    body = validateBody(req.body, movingStockValidations.CREATE_SUPER_ADMIN);
  }
  await startTransaction(async trx => {
    movingStock = await movingStocksService.createMovingStock(body, { trx });
    if (!movingStock) {
      throw {
        statusCode: INTERNAL_SERVER_ERROR,
        errorCode: 'Cannot create Moving Stock'
      };
    }
    const isLocked = await carpetsService.lockCarpets(movingStock.sentCarpets, {
      trx
    });
    if (!isLocked) {
      throw { statusCode: INTERNAL_SERVER_ERROR };
    }
  });

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
  await startTransaction(async trx => {
    const movingStock = await movingStocksService.getMovingStockByIdAndLock(
      movingStockId,
      { trx }
    );
    const isLocked = await carpetsService.unLockCarpets(
      movingStock.sentCarpets,
      { trx }
    );
    if (!isLocked) {
      throw { statusCode: INTERNAL_SERVER_ERROR };
    }
    const isUpdated = await movingStocksService.acceptMovingStock(
      movingStockId,
      body,
      { trx }
    );
    if (!isUpdated) {
      throw { statusCode: INTERNAL_SERVER_ERROR };
    }
    const updates = await Promise.all(
      body.receivedCarpets.map((id: string) =>
        carpetsService.moveCarpetToBranch(id, branch, { trx })
      )
    );
    if (updates.some(u => !u)) {
      throw { statusCode: INTERNAL_SERVER_ERROR };
    }
  });
  res.status(NO_CONTENT).send();
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
