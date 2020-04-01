import { S3 } from 'aws-sdk';
import { Agent } from 'https';
import config from '../config';

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } = config;

const agent = new Agent({
  maxSockets: Infinity,
  keepAlive: true
});

const s3 = new S3({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  httpOptions: {
    agent
  }
});

export { s3 };
