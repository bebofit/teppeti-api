import { UNSUPPORTED_MEDIA_TYPE } from 'http-status';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { IRequest } from '../common/types';
import { genToken } from '../common/utils';
import { s3 } from './aws-sdk';
import multerS3Transformer, { Transformations } from './multer-s3-transformer';

const multerFactory = (
  bucket: string,
  folder: (req: IRequest) => string,
  acl: string,
  allowedTypes?: string[],
  transformations?: Transformations,
  asyncValidator?: (req: IRequest) => Promise<void>
) =>
  multer({
    storage: multerS3Transformer(
      {
        s3,
        bucket,
        acl,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata(
          req: IRequest,
          file: Express.MulterS3.File,
          callback: (err: any, meta: any) => any
        ): void {
          callback(null, file);
        },
        async key(
          req: IRequest,
          file: Express.MulterS3.File,
          callback: (err: any, meta: any) => any
        ): Promise<void> {
          try {
            const token = await genToken();
            callback(
              null,
              `${folder(req)}/${token}.${file.mimetype.split('/')[1]}`
            );
          } catch (err) {
            callback(err, null);
          }
        }
      },
      transformations
    ),
    async fileFilter(
      req: IRequest,
      file: Express.MulterS3.File,
      callback: (err: any, meta: any) => any
    ): Promise<void> {
      if (asyncValidator) {
        try {
          await asyncValidator(req);
        } catch (err) {
          return callback(err, null);
        }
      }
      const typeArray = file.mimetype.split('/');
      const isAllowed =
        allowedTypes &&
        (allowedTypes.includes(typeArray[0]) ||
          allowedTypes.includes(typeArray[1]));
      if (!isAllowed) {
        return callback(
          {
            error: `Only files of type ${allowedTypes} are allowed.`,
            statusCode: UNSUPPORTED_MEDIA_TYPE,
            errorCode: 'err_invalid_input',
            validationError: true
          },
          null
        );
      }
      callback(null, true);
    }
  });

export default multerFactory;
