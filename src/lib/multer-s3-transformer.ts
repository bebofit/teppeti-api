import { StorageEngine } from 'multer';
import multerS3 from 'multer-s3';

export interface Transformations {
  [key: string]: () => any;
}

class MulterS3Transformer {
  private s3Storage: StorageEngine;

  constructor(options: any, private transformations?: Transformations) {
    this.s3Storage = multerS3(options);
  }

  // tslint:disable-next-line: function-name
  _handleFile(req: any, file: any, callback: any): void {
    const fileType = file.mimetype.split('/');
    const transformationFn =
      this.transformations &&
      (this.transformations[fileType[1]] || this.transformations[fileType[0]]);
    if (transformationFn) {
      Object.defineProperty(file, 'stream', {
        configurable: true,
        enumerable: false,
        value: file.stream.pipe(transformationFn())
      });
    }
    this.s3Storage._handleFile(req, file, callback);
  }

  // tslint:disable-next-line: function-name
  _removeFile(req: any, file: any, callback: any): void {
    this.s3Storage._removeFile(req, file, callback);
  }
}

export default function multerS3Transformer(
  options: any,
  transformations?: Transformations
): MulterS3Transformer {
  return new MulterS3Transformer(options, transformations);
}
