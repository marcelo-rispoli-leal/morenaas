import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../services/db.js';

//sets user authentication jwt token
function authToken(cpf, worker, customer) {
  //loads environment variables
  const { SECRET, EXPIRE } = process.env;

  //sets jwt token
  const token = jwt.sign({ cpf, worker, customer }, SECRET, {
    expiresIn: +EXPIRE,
  });

  return token;
}

//sets user reset password crypto token
async function resetToken(cpf) {
  //generates reset password crypto token
  const token = crypto.randomBytes(30).toString('hex');

  //sets reset token expiration
  let now = new Date();
  now.setHours(now.getHours() + 1);
  now = now.toISOString();

  //updates user
  await setFields(
    'users',
    'reset_pass_token=$1, reset_pass_expires=$2',
    [token, now, cpf],
    'cpf=$3'
  );

  //returns token
  return token;
}

//encrypts password
async function password(password) {
  const hash = await bcrypt.hash(password, 12);
  return hash;
}

//updates database table fields
async function fields(table, fields, values, where = null) {
  let sql = `update ${table} set ${fields} where `;
  sql += where !== null ? `${where}` : '1=1';

  return await db.pool.query(sql, values);
}

export default { authToken, resetToken, password, fields };
