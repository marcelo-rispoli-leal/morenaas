//import dependencies
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDoc } from './app/docs/doc.js';
//import router controllers
import { authRouter } from './app/routes/authRouter.js';
import { userRouter } from './app/routes/userRouter.js';
import { movieRouter } from './app/routes/movieRouter.js';
import { db } from './app/services/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Custom logger for shutdown debugging
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logPath = path.join(__dirname, 'shutdown.log');
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  fs.appendFileSync(logPath, logMessage);
  console.log(message); // Also log to console for standard log
};

let server;

// Graceful shutdown logic
const shutdown = (signal) => {
  log(`[shutdown] 🛑 Received ${signal}. Starting graceful shutdown.`);

  const timeout = setTimeout(() => {
    log('[shutdown] ⚠️ Shutdown timed out after 8s. Forcing exit.');
    process.exit(1);
  }, 8000).unref();

  if (!server) {
    log('[shutdown] Server not initialized. Exiting.');
    clearTimeout(timeout);
    return process.exit(0);
  }

  log('[shutdown] 1. Closing HTTP server...');
  server.close(async (err) => {
    if (err) {
      log(`[shutdown] ❌ Error closing HTTP server: ${err.message}`);
    } else {
      log('[shutdown] ✅ HTTP server closed.');
    }

    try {
      log('[shutdown] 2. Closing database pool...');
      await db.close();
      log('[shutdown] ✅ Database pool closed.');
    } catch (dbErr) {
      log(`[shutdown] ❌ Error closing database pool: ${dbErr.message}`);
      process.exit(1); // Exit with failure
    }

    log('[shutdown] 3. Shutdown complete. Exiting process.');
    clearTimeout(timeout);
    process.exit(0); // Exit with success
  });
};

// Listen for termination signals
process.on('SIGTERM', () => {
  log('Received SIGTERM signal.');
  shutdown('SIGTERM');
});

/* process.on('SIGUSR2', () => {
  log('Received SIGUSR2 signal.');
  shutdown('SIGUSR2');
}); */

//start express app
const app = express();

//for parsing application/json
app.use(express.json());

//for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//router app
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/movie', movieRouter);

//get root
app.get('/', (_, res) => {
  res.redirect('/docs');
});

//response errors
app.use('/', (err, _, res, __) => {
  if (err.message.substr(0, 1) === '{' && err.message.substr(-1) === '}') {
    //sends response for mapped errors
    const { status, error } = JSON.parse(err.message);
    res.status(status).send({ error: `${error}` });
  } else {
    //sends respose for unhandled errors
    res.status(500).send({ error: `${err.message}` });
  }
});

//backend listening
const { APP_HOST, PORT } = process.env;
const host = APP_HOST || 'http://localhost:3001';
const port = PORT || 3001;

server = app.listen(port, async () => {
  try {
    console.log(`API Started on host '${host}' and port '${port}'`);
  } catch (err) {
    console.log(err);
  }
});
