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

let server;

// Graceful shutdown logic
const shutdown = (signal) => {
  console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async (err) => {
      console.log('🔌 Closing database pool...');
      await db.close();
      if (err) {
        console.error('❌ Error during server close:', err);
        process.exit(1);
      }
      console.log('✅ Server and database pool closed. Exiting process.');
      process.exit(0);
    });

    // Force shutdown if graceful shutdown takes too long
    setTimeout(() => {
      console.warn('⚠️ Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 10000); // 10-second timeout
  } else {
    console.log('⚠️ Server not initialized. Exiting directly.');
    process.exit(0);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGUSR2', () => shutdown('SIGUSR2'));

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
