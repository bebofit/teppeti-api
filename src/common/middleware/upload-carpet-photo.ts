import sharp from 'sharp';
import config from '../../config';
import multerFactory from '../../lib/multer';
import { IRequest } from '../types';

const { S3_BUCKET } = config;

const folder = (req: IRequest): string => `carpets/${req.authInfo.branch}`;

const transformations = {
  image: () =>
    sharp()
      .png({ quality: 80 })
      .jpeg({ quality: 80, progressive: true })
};

const multerInstance = multerFactory(
  S3_BUCKET,
  folder,
  'public-read',
  ['image'],
  transformations
);

const middleware = multerInstance.single('file');

export default middleware;
