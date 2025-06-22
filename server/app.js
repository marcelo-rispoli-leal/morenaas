//import dependencies
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDoc } from './app/docs/doc.js';
//import router controllers
import { authRouter } from './app/routes/authRouter.js';
import { userRouter } from './app/routes/userRouter.js';
import { movieRouter } from './app/routes/movieRouter.js';

// Handler for hot restart via SIGUSR2
process.on('SIGUSR2', () => {
  console.log('🔄 Received SIGUSR2 signal - Restarting application...');

  // Close existing connections gracefully
  server.close(() => {
    console.log('✅ Server closed. Restarting process...');
    process.exit(0);
  });

  // Force exit after 10 seconds if can't close gracefully
  setTimeout(() => {
    console.log('⚠️ Forcing process termination...');
    process.exit(1);
  }, 10000);
});

// Handler for SIGTERM (used by AlwaysData to stop the process)
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM - Shutting down application...');

  server.close(() => {
    console.log('✅ Application shutdown gracefully');
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000);
});

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

app.listen(port, async () => {
  try {
    console.log(`API Started on host '${host}' and port '${port}'`);
  } catch (err) {
    console.log(err);
  }
});
