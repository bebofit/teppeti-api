import { Response } from 'express';
import { IRequest } from '../../common/types';
import * as carpetValidations from './validations';
import * as carpetsService from './service';
import * as salesService from '../sales/service';
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
import { Branch } from '../../common/enums';
import { storageService } from '../../common/services';
import { startTransaction } from '../../database';

async function getAllCarepts(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const carpets = await carpetsService.getCarpets(paginationOptions);
  const data = {
    carpetsT: carpets.filter((c: any) => c.branch === Branch.Tagamo3),
    carpetsA: carpets.filter((c: any) => c.branch === Branch.Arkan),
    carpetsS: carpets.filter((c: any) => c.branch === Branch.Sakara)
  };
  res.status(OK).json({ data });
}

async function getSoldCarepts(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const carpets = await carpetsService.getSoldCarpets(paginationOptions);
  res.status(OK).json({ carpets });
}

async function getCarpetsByBranch(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const { isSuperAdmin, branch: authBranch } = req.authInfo;
  const branch = isSuperAdmin ? req.query.branch : authBranch;
  const carpets = await carpetsService.getCarpetsByBranch(
    branch,
    paginationOptions
  );
  res.status(OK).json({ data: carpets });
}

async function getCarpetById(req: IRequest, res: Response): Promise<any> {
  const carpetId = req.params.carpetId;
  validateDBId(req.params.carpetId);
  const carpet = await carpetsService.getCarpetById(carpetId);
  if (!carpet) {
    throw {
      statusCode: NOT_FOUND,
      message: 'Cannot find Carpet'
    };
  }
  res.status(OK).json({
    data: carpet
  });
}

async function searchCarpets(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const { branch } = req.authInfo;
  const body = validateBody(req.body, carpetValidations.SEARCH_CARPETS);
  const data = await carpetsService.searchCarpets(
    branch,
    body,
    paginationOptions
  );
  res.status(OK).json({
    data
  });
}

async function addCarpet(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, carpetValidations.ADD_CARPET);
  const carpet = await carpetsService.createCarpet(body);
  if (!carpet) {
    throw {
      statusCode: INTERNAL_SERVER_ERROR,
      message: 'Cannot create Carpet'
    };
  }
  res.status(CREATED).json({
    data: carpet
  });
}

async function sellCarpet(req: IRequest, res: Response): Promise<any> {
  const carpetId = req.params.carpetId;
  validateDBId(req.params.carpetId);
  const { finalPricePerSquareMeter, client } = validateBody(
    req.body,
    carpetValidations.SELL_CARPET
  );
  await startTransaction(async trx => {
    const carpet = await carpetsService.sellCarpet(
      carpetId,
      finalPricePerSquareMeter,
      client,
      { trx }
    );
    if (!carpet) {
      throw {
        statusCode: INTERNAL_SERVER_ERROR,
        message: 'Cannot find Carpet'
      };
    }
    const price = carpet.length * carpet.width * finalPricePerSquareMeter;
    const sale = await salesService.createSale(
      price,
      new Date(),
      carpet.branch,
      carpet,
      {
        trx
      }
    );
    if (!sale) {
      throw {
        statusCode: INTERNAL_SERVER_ERROR,
        message: 'Cannot Create Sale'
      };
    }
  });
  res.status(NO_CONTENT).send();
}

async function updateCarpet(req: IRequest, res: Response): Promise<any> {
  const carpetId = req.params.carpetId;
  validateDBId(req.params.carpetId);
  const body = validateBody(req.body, carpetValidations.UPDATE_CARPET);
  const carpet = await carpetsService.updateCarpet(carpetId, body);
  if (!carpet) {
    throw {
      statusCode: NOT_FOUND,
      message: 'Cannot find Carpet'
    };
  }
  res.status(OK).json({
    data: carpet
  });
}

async function updatePhoto(req: IRequest, res: Response): Promise<any> {
  const carpetId = req.params.carpetId;
  validateDBId(req.params.carpetId);
  const file = req.file as Express.MulterS3.File;
  const photo = {
    type: file.mimetype,
    size: file.size,
    path: file.key,
    url: file.location
  };
  const carpet = await carpetsService.updatePhoto(carpetId, photo, {
    new: false
  });
  if (!carpet) {
    await storageService.deleteFile(file.key);
    throw { statusCode: NOT_FOUND };
  }
  if (
    carpet.photo &&
    carpet.photo.path !==
      'misc/15285015_210987272691273_3848920454272905498_n.png'
  ) {
    await storageService.deleteFile(carpet.photo.path);
  }
  res.status(OK).json({
    data: photo
  });
}

async function softDeleteCarpet(req: IRequest, res: Response): Promise<any> {
  const carpetId = req.params.carpetId;
  validateDBId(req.params.carpetId);
  const isDeleted = await carpetsService.softDeleteCarpet(carpetId);
  if (!isDeleted) {
    throw { statusCode: INTERNAL_SERVER_ERROR };
  }
  res.status(NO_CONTENT).send();
}

export {
  addCarpet,
  sellCarpet,
  searchCarpets,
  getCarpetsByBranch,
  getAllCarepts,
  getSoldCarepts,
  getCarpetById,
  updateCarpet,
  updatePhoto,
  softDeleteCarpet
};
