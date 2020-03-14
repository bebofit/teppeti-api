import mongoose, { ClientSession } from 'mongoose';
import config, { isProduction, isTesting } from '../config';

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = config;

async function startDB(): Promise<void> {
  await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}`, {
    dbName: isTesting ? 'teppetiTestDB' : DB_NAME,
    user: DB_USER,
    pass: DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: !isProduction
  });
  console.log('Connected to MongoDB');
}

async function startTransaction(
  callback: (session: ClientSession) => Promise<any>
): Promise<void> {
  const session = await mongoose.startSession();
  await session.withTransaction(callback, { writeConcern: { wtimeout: 5000 } });
  session.endSession(error => {
    if (error) {
      console.error(error);
    }
  });
}

async function stopDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

async function dropDB(): Promise<void> {
  await mongoose.connection.db.dropDatabase();
  console.log('Dropped the DB');
}

export { startDB, stopDB, dropDB, startTransaction };
