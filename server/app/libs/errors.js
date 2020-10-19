import bcrypt from 'bcryptjs';
import { formatName } from './formatters.js';

//sends message error
function msgError(error, status = 400) {
  throw new Error(JSON.stringify({ status, error }));
}

//#region required content errors
const requiredBody = (reqBody) => {
  if (Object.keys(reqBody).length === 0) {
    msgError(`The request body must have fields informed.`);
  }
};

const requiredParams = (reqParams) => {
  if (Object.keys(reqParams).length === 0) {
    msgError(`The request parameters must have fields informed.`);
  }
};

const requiredFields = (obj) => {
  let required = '';
  let omitted = '';
  let verb = '';
  let subject = '';
  let chk = false;

  //records the name of all required objects and lists the undefined ones
  Object.getOwnPropertyNames(obj).forEach((val) => {
    if (!obj[val]) {
      chk = true;
      omitted += omitted === '' ? `'${val}'` : `, '${val}'`;
      subject = subject === '' ? `field` : `fields`;
      verb = verb === '' ? `has` : `have`;
    }
    required += required === '' ? `'${val}'` : `, '${val}'`;
  });

  //triggers error message if one required object are undefined
  if (chk) {
    if (required.includes(', ')) {
      msgError(
        `The fields ${required} are required in this request, ` +
          `but the ${subject} ${omitted} ${verb} been omitted.`
      );
    } else {
      msgError(
        `The field ${required} is required in this request, ` +
          `but ${verb} been omitted.`
      );
    }
  }
};

const requiredPDF = (isWorker = false) => {
  let msg = !isWorker
    ? `This request must have a PDF file uploaded. `
    : `The user didn't upload a file. `;
  msg += `Client access is granted after sending and approving the documentation.`;

  msgError(msg);
};

const requiredReturn = (count) => {
  if (count > 0) {
    const term = count > 1 ? 'movies' : 'movie';
    const verb = count > 1 ? 'are' : 'is';

    msgError(
      `According to our system, there ${verb} ${term} rented with you. ` +
        'You can delete your registration after the return.'
    );
  }
};
//#endregion

//#region duplicate values errors
const userAlreadyExists = (key, value) => {
  msgError(`User with ${key} '${value}' already registered.`);
};

const movieAlreadyExists = (title, director) => {
  msgError(
    `Movie with title '${title}' and director '${director}' already registered.`
  );
};
//#endregion

//#region not found errors
const userNotFound = (key, email) => {
  msgError(`User with ${key} '${email}' not found.`, 404);
};

const usersNotFound = (category = 'all', name = '') => {
  let msgPrefix =
    category === 'all'
      ? 'Users'
      : category === 'unchecked'
      ? 'Unchecked users'
      : category === 'PF'
      ? 'Physical person users'
      : 'Worker users';

  if (name.trim() !== '') {
    msgPrefix += ` with case-insensitive name containing '${name}'`;
  }

  msgError(`${msgPrefix} not found.`, 404);
};

const movieNotFound = (movie_id) => {
  msgError(
    `Movie with id '${movie_id}' not found. See the list of movies.`,
    404
  );
};

const rentedTapesNotFound = (rent_id) => {
  msgError(`No movies found to return on rent with id '${rent_id}'.`, 404);
};

const moviesNotFound = (status = 'all', title = '') => {
  let msgPrefix = status === 'all' ? 'Movies' : `${formatName(status)} movies`;

  if (title.trim() !== '') {
    msgPrefix += ` with case-insensitive title containing '${title}'`;
  }

  msgError(`${msgPrefix} not found.`, 404);
};

const moviesIdsNotFound = () => {
  msgError(
    'Movies requested for rental not found. See the list of available movies.',
    404
  );
};
//#endregion

//#region invalid values
const invalidCpf = (cpf) => {
  msgError(`'${cpf}' is not a valid CPF.`);
};

const invalidEmail = (email) => {
  msgError(`'${email}' is not a valid email.`);
};

const invalidPhoneNumber = (number, isMobile = true) => {
  const type = isMobile ? 'mobile' : 'landline';
  msgError(
    `The number '${number}' is not a valid Brazilian ` +
      `${type} phone according to Google rules.`
  );
};

const invalidUserPass = async (reqPass, userPass) => {
  if (!(await bcrypt.compare(reqPass, userPass))) {
    msgError(`Incorret password informed.`);
  }
};

const invalidResetToken = (reqToken, userToken, userTokenExpires) => {
  if (reqToken !== userToken) {
    msgError('Incorrect token for password reset informed.');
  }

  const now = new Date();
  if (now > userTokenExpires) {
    msgError('Token for password reset expired. Request a new one.');
  }
};

const invalidMovies = () => {
  msgError(
    'Movies requested for rental are invalid. See the list of available movies.'
  );
};

const invalidRent = (id) => {
  msgError(
    `The movie rental with id '${id}' is invalid. Your user has not made this rental.`
  );
};
//#endregion

//#region jwt authentication errors
const jwtAuthHeaderFailure = (authHeader) => {
  //check token informed
  if (!authHeader) {
    msgError('No token provided.', 401);
  }

  //check token parts
  const parts = authHeader.split(' ');
  if (!parts.length === 2) {
    msgError('Token does not have two parts.', 401);
  }

  //check token prefix
  if (!/^Bearer$/i.test(parts[0])) {
    msgError('Malformed token, the prefix is ​​invalid.', 401);
  }
};

const jwtRejected = (message) => {
  msgError('Token invalid, ' + message + '.', 401);
};

const jwtReplaced = (reqToken, userToken) => {
  if (reqToken !== userToken) {
    msgError('The provided token has been replaced and discontinued.', 401);
  }
};
//#endregion

//#region access rights errors
const userAccessOnly = (reqCustomer = true) => {
  if (reqCustomer !== false) {
    msgError(
      `This content can only be accessed by non-customer users. ` +
        `This change is carried out by our support team through a ticket.`,
      403
    );
  }
};

const workerAccessOnly = (reqWorker = false) => {
  if (reqWorker !== true) {
    msgError('This content can only be accessed by our employees.', 403);
  }
};

const customerAccessOnly = (reqCustomer = false) => {
  if (reqCustomer !== true) {
    msgError(
      'This content can only be accessed by users with customer access. ' +
        'Wait for our evaluation if have already sent your documentation.',
      403
    );
  }
};
//#endregion

export default {
  //required content errors
  requiredBody,
  requiredParams,
  requiredFields,
  requiredPDF,
  requiredReturn,
  //duplicate errors
  userAlreadyExists,
  movieAlreadyExists,
  //not found errors
  userNotFound,
  usersNotFound,
  movieNotFound,
  rentedTapesNotFound,
  moviesNotFound,
  moviesIdsNotFound,
  //invalid values errors
  invalidCpf,
  invalidEmail,
  invalidPhoneNumber,
  invalidUserPass,
  invalidResetToken,
  invalidMovies,
  invalidRent,
  //jwt errors
  jwtAuthHeaderFailure,
  jwtRejected,
  jwtReplaced,
  //access rights errors
  userAccessOnly,
  workerAccessOnly,
  customerAccessOnly,
};
