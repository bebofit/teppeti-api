import { Response } from 'express';
import {
  CREATED,
  NOT_FOUND,
  NO_CONTENT,
  OK,
  INTERNAL_SERVER_ERROR
} from 'http-status';
// import { emailsService } from '../../common/services';
import { IRequest } from '../../common/types';
import {
  extractPaginationOptions,
  validateBody,
  validateDBId
} from '../../common/utils';
import * as trialsService from './service';
import * as carpetsService from '../carpets/service';
import * as trialsValidations from './validations';
import { startTransaction } from '../../database';

async function getTrials(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const { isSuperAdmin, branch } = req.authInfo;
  const sender = isSuperAdmin ? req.query.branch : branch;
  const trials = await trialsService.getTrials(sender, paginationOptions);
  res.status(OK).json({
    data: trials
  });
}

async function getTrialById(req: IRequest, res: Response): Promise<any> {
  const trialId = req.params.trialId;
  validateDBId(trialId);
  const user = await trialsService.getTrialById(trialId);
  if (!user) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(OK).json({
    data: user
  });
}

async function createTrail(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, trialsValidations.CREATE);
  const trial = await trialsService.createTrial(body);
  res.status(CREATED).json({
    data: trial
  });
}

async function updateTrial(req: IRequest, res: Response): Promise<any> {
  const trialId = req.params.trialId;
  validateDBId(trialId);
  const body = validateBody(req.body, trialsValidations.UPDATE);
  const user = await trialsService.updateTrial(trialId, body);
  if (!user) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(OK).json({
    data: user
  });
}

async function acceptTrial(req: IRequest, res: Response): Promise<any> {
  const trialId = req.params.trialId;
  validateDBId(req.params.trialId);
  const { isSuperAdmin, branch } = req.authInfo;
  let body: any = {};
  if (!isSuperAdmin) {
    body = validateBody(req.body, trialsValidations.ACCEPT_TRIAL);
    body.sender = branch;
  } else {
    body = validateBody(req.body, trialsValidations.ACCEPT_TRIAL_SUPER_ADMIN);
  }
  await startTransaction(async trx => {
    const isUpdated = await trialsService.acceptTrial(trialId, body, { trx });
    if (!isUpdated) {
      throw { statusCode: INTERNAL_SERVER_ERROR };
    }
    const updates = await Promise.all(
      body.soldCarpets.map((c: any) =>
        carpetsService.sellCarpet(c.id, c.finalPricePerSquareMeter, { trx })
      )
    );
    if (updates.some(u => !u)) {
      throw { statusCode: INTERNAL_SERVER_ERROR };
    }
  });
  res.status(NO_CONTENT).send();
}

async function softDeleteTrial(req: IRequest, res: Response): Promise<any> {
  const trialId = req.params.trialId;
  validateDBId(trialId);
  const isDeleted = await trialsService.softDeleteTrial(trialId);
  if (!isDeleted) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(NO_CONTENT).send();
}

export {
  getTrials,
  getTrialById,
  createTrail,
  updateTrial,
  acceptTrial,
  softDeleteTrial
};
