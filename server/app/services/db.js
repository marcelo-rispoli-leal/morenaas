//imports dependencies
import pg from 'pg';
// import userModel from '../models/user.js';
// import accountModel from '../models/account.js';
// import transactionModel from '../models/transaction.js';

//creates database connection
const db = {};

db.pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 3000,
});

// db.pool.on('connect', () => {
//   console.log('Base de Dados conectado com sucesso!');
// });

// db.query = db.pool.query;

// db.mongoose = mongoose;
// db.url = process.env.MONGOURL;
// db.mongoose.connect(db.url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });

// //associates models with the database
// db.userModel = userModel(mongoose);
// db.accountModel = accountModel(mongoose);
// db.transactionModel = transactionModel(mongoose);

// db.query = (text, params) => {
//   db.pool.query(text, params);
// };

export { db };
