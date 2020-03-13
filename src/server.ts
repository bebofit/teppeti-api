import http from 'http';
import { startDB, stopDB } from './database';
import app from './app';
import config from './config';

const { PORT } = config;

let server: http.Server;

const listen = (): Promise<void> =>
  new Promise(resolve => server.listen(PORT, resolve));

const unlisten = (): Promise<void> =>
  new Promise((resolve, reject) => {
    server.close((err: Error) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

async function startServer(): Promise<void> {
  // await Promise.all([startDB(), connectToES(), connectToRedis()]);
  await startDB();
  server = http.createServer(app);
  await listen();
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

async function closeServer(): Promise<void> {
  await unlisten();
  server = null;
  // await Promise.all([stopDB(), disconnectFromES(), disconnectFromRedis()]);
  await stopDB();
}

export { startServer, closeServer };
