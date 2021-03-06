import { S3 } from 'aws-sdk';
import config from '../../config';
import { s3 } from '../../lib/aws-sdk';

const { S3_BUCKET, BACKUP_KEY } = config;

async function deleteFile(key: string): Promise<boolean> {
  const { $response } = await s3
    .deleteObject({ Bucket: S3_BUCKET, Key: key })
    .promise();
  const { error, data } = $response;
  if (error) {
    throw error;
  }
  return (data as S3.DeleteObjectOutput).DeleteMarker;
}

async function deleteFiles(keys: string[]): Promise<boolean> {
  const { $response } = await s3
    .deleteObjects({
      Bucket: S3_BUCKET,
      Delete: { Objects: keys.map(key => ({ Key: key })) }
    })
    .promise();
  const { error, data } = $response;
  if (error) {
    throw error;
  }
  return (data as S3.DeleteObjectOutput).DeleteMarker;
}

async function uploadFile(
  fileName: string,
  fileData: any,
  key: string
): Promise<any> {
  if (key !== BACKUP_KEY) {
    return;
  }
  const { Location } = await s3
    .upload({
      Bucket: S3_BUCKET,
      Key: `backup/${fileName}.json`,
      ContentType: 'application/json',
      Body: JSON.stringify(fileData),
      ACL: 'public-read'
    })
    .promise();
  return Location;
}

export { deleteFile, deleteFiles, uploadFile };
