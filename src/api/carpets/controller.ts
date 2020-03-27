import { Response } from 'express';
import { IRequest } from '../../common/types';
import * as carpetValidations from './validations';
import * as carpetsService from './service';
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
      errorCode: 'Cannot find Carpet'
    };
  }
  res.status(OK).json({
    data: carpet
  });
}

async function addCarpet(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, carpetValidations.ADD_CARPET);
  body.code = Math.floor(Math.random() * 10000);
  const carpet = await carpetsService.createCarpet(body);
  if (!carpet) {
    throw {
      statusCode: INTERNAL_SERVER_ERROR,
      errorCode: 'Cannot create Carpet'
    };
  }
  res.status(CREATED).json({
    data: carpet
  });
}

async function updateCarpet(req: IRequest, res: Response): Promise<any> {
  const carpetId = req.params.carpetId;
  validateDBId(req.params.carpetId);
  const body = validateBody(req.body, carpetValidations.UPDATE_CARPET);
  const carpet = await carpetsService.updateCarpet(carpetId, body);
  if (!carpet) {
    throw {
      statusCode: NOT_FOUND,
      errorCode: 'Cannot find Carpet'
    };
  }
  res.status(OK).json({
    data: carpet
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
  getCarpetsByBranch,
  getAllCarepts,
  getCarpetById,
  updateCarpet,
  softDeleteCarpet
};