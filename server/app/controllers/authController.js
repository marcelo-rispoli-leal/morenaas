//imports dependencies
import { db } from '../services/db.js';
import errors from '../libs/errors.js';
import alerts from '../libs/alerts.js';
import emails from '../libs/mailer.js';
import parsers from '../libs/parsers.js';
import gets from '../libs/getters.js';
import sets from '../libs/setters.js';
import { formatName } from '../libs/formatters.js';
import { renameFile, deleteFile } from '../libs/fileManager.js';

//user creation
const createUser = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { name, cpf, email, password } = req.body;

    //checks required fields
    errors.requiredFields({ name, cpf, email, password });

    //checks and formats CPF or sends error
    cpf = parsers.cpf(cpf);

    //checks and formats email or sends error
    email = parsers.email(email);

    //checks if user already exists
    await gets.user('cpf', cpf, null, false);
    await gets.user('email', email, null, false);

    password = await sets.password(password);

    const token = sets.authToken(cpf, false, false);

    //formats valid phones or adds an alert with invalid numbers
    const { mobile, landline } = req.body;
    const phones = alerts.phoneNotRecorded(mobile, landline);
    let alert = phones.alert;

    //renames uploaded PDF or alerts that the account is opened after upload
    req.file !== undefined
      ? renameFile(req.file, cpf)
      : (alert = { ...alert, file: alerts.userNotUploadPDF() });

    const file_name = req.file && req.file.filename;
    const file_path = req.file && req.file.path;
    const created_at = gets.now();

    //formats name
    name = formatName(name);

    const sql = `INSERT INTO users (cpf, name, email, mobile, landline, `;
    sql += `password, file_name, file_path, created_at, token) `;
    sql += `VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    await db.pool.query(sql, [
      cpf,
      name,
      email,
      mobile,
      landline,
      password,
      file_name,
      file_path,
      created_at,
      token,
    ]);

    const user = {
      cpf,
      name,
      email,
      mobile,
      landline,
      file_name,
      created_at,
      token,
    };

    //sends response with saved user and alerts
    res.send({ user, alert });
  } catch (err) {
    //deletes uploaded file on error
    deleteFile(req.file);

    next(err);
  }
};

//user authentication - see a "Very Important" comment
const logIn = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { email, password } = req.body;

    //checks required fields
    errors.requiredFields({ email, password });

    //checks and formats email
    email = parsers.email(email);

    //checks if user not found
    const user = await gets.user(
      'email',
      email,
      'cpf, name, password, worker, customer'
    );

    let { cpf, name, worker, customer } = user;

    //checks password
    await errors.invalidUserPass(password, user.password);

    /*********************
    Very Important - Start
    **********************

    This is the way to set the first worker user.

    Thus, this user can authenticate to update the user registration 
    of other workers and yours. 

    After adjusting the user registration of the first workers, 
    the WORKERCPF environment variable must be cleared or deleted.

    It's recommended delete the WORKERCPF environment variable, 
    the "if" snippet below and all this "Very Important" comment. */

    if (process.env.WORKERCPF === cpf && worker === false) {
      worker = true;
    }
    /**********************
    Very Important - Finish
    **********************/

    //generates token and sends it in response
    const token = sets.authToken(cpf, worker, customer);

    //update user
    await sets.fields('users', 'token=$1', [token, cpf], 'cpf=$2');

    res.send({ cpf, name, email, token });
  } catch (err) {
    next(err);
  }
};

//remove user authentication
const logOut = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { email } = req.body;

    //checks required fields
    errors.requiredFields({ email });

    //checks and formats email
    email = parsers.email(email);

    //checks if user not found
    const user = await gets.user('email', email, 'cpf');

    //clear user token
    await sets.fields('users', 'token=$1', [null, user.cpf], 'cpf=$2');

    res.send({ success: 'Logged out user.' });
  } catch (err) {
    next(err);
  }
};

//user forgot pass
const forgotPass = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { email } = req.body;

    //checks required fields
    errors.requiredFields({ email });

    //checks and formats email
    email = parsers.email(email);

    //checks if user not found
    const user = await gets.user('email', email, 'cpf');

    //generates reset password crypto token
    const token = await sets.resetToken(user.cpf);

    //sends forgot password email
    emails.forgotPass(email, token);

    //sends successful response
    res.send({ success: 'Forgot password email sended.' });
  } catch (err) {
    next(err);
  }
};

//user reset pass forgotten
const resetPass = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { email, password, token } = req.body;

    //checks required fields
    errors.requiredFields({ email, password, token });

    //checks and formats CPF or CNPJ
    email = parsers.email(email);

    //checks if user not found
    const { cpf, reset_pass_token, reset_pass_expires } = await gets.user(
      'email',
      email,
      'cpf, reset_pass_token, reset_pass_expires'
    );

    //checks reset token content
    errors.invalidResetToken(token, reset_pass_token, reset_pass_expires);

    //encrypts password
    password = await sets.setPassword(password);

    //updates password
    await sets.setFields('users', 'password=$1', [password, cpf], 'cpf=$2');

    //sends successful response
    res.send({ success: 'Password redefined.' });
  } catch (err) {
    next(err);
  }
};

export default { createUser, logIn, logOut, forgotPass, resetPass };
