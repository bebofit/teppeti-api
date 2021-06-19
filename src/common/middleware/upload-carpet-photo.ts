import config from '../../config';
import multerFactory from '../../lib/multer';
import { IRequest } from '../types';

const { S3_BUCKET } = config;

const folder = (req: IRequest): string => `carpets/${req.authInfo.branch}`;

const multerInstance = multerFactory(S3_BUCKET, folder, 'public-read', [
  'image'
]);

const middleware = multerInstance.single('file');

export default middleware;
