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
import * as clientsService from './service';
import * as clientValidations from './validations';

async function getClients(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const clients = await clientsService.getClients(paginationOptions);
  res.status(OK).json({ clients });
}

async function searchClients(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const clients = await clientsService.searchClients(paginationOptions);
  res.status(OK).json({ clients });
}

async function getClientById(req: IRequest, res: Response): Promise<any> {
  const clientId = req.params.clientId;
  validateDBId(req.params.clientId);
  const client = await clientsService.getClientById(clientId);
  if (!client) {
    throw {
      statusCode: NOT_FOUND,
      message: 'Cannot find Client'
    };
  }
  res.status(OK).json({
    data: client
  });
}

async function createClient(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, clientValidations.CREATE_CLIENT);
  const client = await clientsService.createClient(body);
  if (!client) {
    throw {
      statusCode: INTERNAL_SERVER_ERROR,
      message: 'Cannot create Client'
    };
  }
  res.status(CREATED).json({
    data: client
  });
}

async function updateClient(req: IRequest, res: Response): Promise<any> {
  const clientId = req.params.clientId;
  validateDBId(req.params.clientId);
  const body = validateBody(req.body, clientValidations.UPDATE_CLIENT);
  const carpet = await clientsService.updateClient(clientId, body);
  if (!carpet) {
    throw {
      statusCode: NOT_FOUND,
      message: 'Cannot find Client'
    };
  }
  res.status(OK).json({
    data: carpet
  });
}

async function softDeleteClient(req: IRequest, res: Response): Promise<any> {
  const clientId = req.params.clientId;
  validateDBId(req.params.clientId);
  const isDeleted = await clientsService.softDeleteClient(clientId);
  if (!isDeleted) {
    throw { statusCode: INTERNAL_SERVER_ERROR };
  }
  res.status(NO_CONTENT).send();
}

export {
  getClients,
  searchClients,
  getClientById,
  createClient,
  updateClient,
  softDeleteClient
};
