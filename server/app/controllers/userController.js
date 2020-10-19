import { db } from '../services/db.js';
import errors from '../libs/errors.js';
import parsers from '../libs/parsers.js';
import alerts from '../libs/alerts.js';
import gets from '../libs/getters.js';
import sets from '../libs/setters.js';
import emails from '../libs/mailer.js';
import { renameFile, deleteFile } from '../libs/fileManager.js';
import { formatName } from '../libs/formatters.js';

//user gets his own data / worker gets a user's data
function findOne(isWorker = false) {
  return async (req, res, next) => {
    try {
      //initially, load cpf from request
      let cpf = req.cpf;

      //if worker, load cpf from params
      if (isWorker) {
        //checks access rights
        errors.workerAccessOnly(req.worker);

        //checks params and loads field
        errors.requiredParams(req.params);
        cpf = req.params.cpf;

        //checks required field
        errors.requiredFields({ cpf });

        //checks and formats CPF or CNPJ
        cpf = parsers.cpf(cpf);
      }
      //sends error if user not founded or loads your data
      const user = await gets.user(
        'CPF',
        cpf,
        'cpf, name, email, mobile, landline, created_at'
      );

      //if a phone is null, set the field to undefined to not send in response
      const { mobile, landline } = user;
      user.mobile = mobile !== null ? mobile : undefined;
      user.landline = landline !== null ? landline : undefined;

      //sends response with loaded user
      res.send(user);
    } catch (err) {
      next(err);
    }
  };
}

//worker gets users list by category and / or name filter
function findAll(category) {
  return async (req, res, next) => {
    try {
      //checks access rights
      errors.workerAccessOnly(req.worker);

      //loads users or sends a error if not found
      const users = await gets.users(category, req.query.name);

      //sends result
      res.send(users);
    } catch (err) {
      next(err);
    }
  };
}

//worker grants or revokes worker access privileges to a user
function setWorker(worker = true) {
  return async (req, res, next) => {
    try {
      //check access rights
      errors.workerAccessOnly(req.worker);

      //check body and load fields
      errors.requiredBody(req.body);
      let { cpf } = req.body;

      //check required fields
      errors.requiredFields({ cpf });

      //check and format body cpf
      cpf = parsers.cpf(cpf);

      //loads user or sends error if not found
      const user = await gets.user('CPF', cpf, 'cpf, name, email');

      //updates user
      await sets.fields('users', 'worker=$1', [worker, cpf], 'cpf=$2');

      //sends updated user in response
      user.worker = worker;
      res.send(user);
    } catch (err) {
      next(err);
    }
  };
}

//worker grants customer access privileges to a user
const setCustomer = async (req, res, next) => {
  try {
    //checks access rights
    errors.workerAccessOnly(req.worker);

    //checks body and load field
    errors.requiredBody(req.body);
    let { cpf } = req.body;

    //checks required field
    errors.requiredFields({ cpf });

    //checks, formats and loads user or sends error
    cpf = parsers.cpf(cpf);
    let user = await gets.user('CPF', cpf, 'name, email, file_name');

    //checks if the user has sent the documentation file
    !user.file_name && errors.requiredPDF(true);

    //sets user as customer
    await sets.fields('users', 'customer=$1', [true, cpf], 'cpf=$2');

    //sends email to inform the customer about the created account
    emails.setedCustomer(user.email);

    //sends update user in response
    res.send({ cpf, name: user.name, email: user.email, customer: true });
  } catch (err) {
    next(err);
  }
};

//non-customer user updates his own name
const setName = async (req, res, next) => {
  try {
    //checks access rights
    errors.userAccessOnly(req.customer);

    //checks body and load field
    errors.requiredBody(req.body);
    let { name } = req.body;

    //checks required field
    errors.requiredFields({ name });

    //formats name
    name = formatName(name);

    //updates user
    const user = await sets.fields(
      'users',
      'name=$1',
      [name, req.cpf],
      'cpf=$2 RETURNING cpf, name, email'
    );

    //sends updated user in response
    res.send(user.rows[0]);
  } catch (err) {
    next(err);
  }
};

//non-customer user updates his own PDF documentation file
const setFile = async (req, res, next) => {
  try {
    //checks access rights.
    //Only non-customers users can update register files
    errors.userAccessOnly(req.customer);

    //renames file or sends error if not uploaded
    if (req.file) {
      req.file = renameFile(req.file, req.cpf);
    } else {
      errors.requiredPDF(false);
    }

    //loads user's data
    let user = await gets.user('CPF', req.cpf, 'name, email, file_path');

    //updates user
    await sets.fields(
      'users',
      'file_name=$1, file_path=$2',
      [req.file.filename, req.file.path, req.cpf],
      'cpf=$3'
    );

    //deletes previous uploaded file
    let { name, email, file_path } = user;
    file_path = file_path !== null ? file_path : undefined;
    deleteFile({ path: file_path });

    //adds the new filename in the response and sends result
    res.send({ cpf: req.cpf, name, email, file_name: req.file.filename });
  } catch (err) {
    //deletes uploaded file on error
    deleteFile(req.file);

    next(err);
  }
};

//user updates his own email
const setEmail = async (req, res, next) => {
  try {
    //checks body and loads field
    errors.requiredBody(req.body);
    let { email } = req.body;

    //checks required field
    errors.requiredFields({ email });

    //checks new email
    email = parsers.email(email);

    //loads user
    const user = await gets.user('CPF', req.cpf, 'cpf, name, email');

    //check if user by email already exists
    if (email !== user.email) {
      await gets.user('email', email, null, false);

      //updates user
      await sets.fields('users', 'email=$1', [email, req.cpf], 'cpf=$2');
      user.email = email;
    }

    //sends updated user in response
    res.send(user);
  } catch (err) {
    next(err);
  }
};

//user updates his own cel phone number
const setMobile = async (req, res, next) => {
  try {
    //checks body and load field
    errors.requiredBody(req.body);
    let { mobile } = req.body;

    //checks required field
    errors.requiredFields({ mobile });

    //formats phone or return error
    mobile = parsers.phoneNumberBR(mobile, true);

    //updates user
    const user = await sets.fields(
      'users',
      'mobile=$1',
      [mobile, req.cpf],
      'cpf=$2 RETURNING cpf, name, email, mobile'
    );

    //sends updated user in response
    res.send(user.rows[0]);
  } catch (err) {
    next(err);
  }
};

//user updates his own landline number
const setLandline = async (req, res, next) => {
  try {
    //checks body and loads field
    errors.requiredBody(req.body);
    let { landline } = req.body;

    //checks required field
    errors.requiredFields({ landline });

    //formats phone or returns error
    landline = parsers.phoneNumberBR(landline, false);

    //updates user
    const user = await sets.fields(
      'users',
      'landline=$1',
      [landline, req.cpf],
      'cpf=$2 RETURNING cpf, name, email, landline'
    );

    //sends updated user in response
    res.send(user.rows[0]);
  } catch (err) {
    next(err);
  }
};

//user updates his own email and phones
const updateOne = async (req, res, next) => {
  try {
    //checks body and loads fields
    errors.requiredBody(req.body);
    let { email, mobile, landline } = req.body;

    //checks required fields
    errors.requiredFields({ email, mobile, landline });

    //checks new email
    email = parsers.email(email);

    //loads user
    let user = await gets.user('CPF', req.cpf, 'cpf, name, email');

    //check if user by email already exists
    if (email !== user.email) {
      await gets.user('email', email, null, false);
      user.email = email;
    }

    //formats valid phones or adds an alert with invalid numbers
    let phones = alerts.phoneNotRecorded(mobile, landline);

    //updates user
    await sets.fields(
      'users',
      'email=$1, mobile=$2, landline=$3',
      [email, phones.mobile, phones.landline, req.cpf],
      'cpf=$4'
    );

    //send response with updated user and alerts
    user.mobile = phones.mobile;
    user.landline = phones.landline;
    res.send({ user, alert: phones.alert });
  } catch (err) {
    next(err);
  }
};

//deletes an user
const deleteOne = async (req, res, next) => {
  try {
    if (req.customer) {
      //checks if customer has unreturned tapes
      let sql = 'SELECT count(1)::int num FROM rents r INNER JOIN ';
      sql += 'rents_tapes t ON r.id=t.rent_id WHERE cpf=$1 AND returned=$2';
      let count = await db.pool.query(sql, [req.cpf, false]);
      count = count.rowCount === 0 ? count.rowCount : count.rows[0].num;
      errors.requiredReturn(count);
    }

    //deletes user from database
    const user = await gets.user('CPF', req.cpf, 'email, file_path');
    await db.pool.query(`DELETE FROM users WHERE cpf=$1`, [req.cpf]);

    //sends email to report the deletion
    if (!req.customer) {
      //deletes uploaded file if non-customer
      deleteFile({
        path: user.file_path !== null ? user.file_path : undefined,
      });
      emails.deletedUser(user.email, req.cpf);
    } else {
      emails.deletedCustomer(user.email, req.cpf);
    }

    //sends success response
    res.send({
      success: `User with CPF '${req.cpf}' and email '${user.email}' deleted.`,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  findOne,
  findAll,
  setWorker,
  setCustomer,
  setName,
  setFile,
  setEmail,
  setMobile,
  setLandline,
  updateOne,
  deleteOne,
};
