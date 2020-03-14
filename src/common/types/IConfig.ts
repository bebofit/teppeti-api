export interface IConfig {
  FRONTEND_URL: string;
  JWT_SECRET: string;
  CRYPTO_SECRET: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  ES_HOST: string;
  ES_PORT: number;
  ES_USER: string;
  ES_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_DB: number;
  REDIS_PASSWORD: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
  AWS_REGION: string;
  S3_BUCKET: string;
  FIREBASE_CREDENTIALS: string;
  MAILER_SENDER: string;
  NODE_ENV: 'development' | 'testing' | 'staging' | 'production';
  PORT: number;
}
