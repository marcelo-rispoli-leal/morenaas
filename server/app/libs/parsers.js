import validator from 'validator';
import errors from './errors.js';
import { formatCpf, formatPhoneBR } from './formatters.js';

//check, format and return CPF or error
function cpf(cpf) {
  const result = formatCpf(cpf);
  if (result === '') {
    errors.invalidCPF(cpf);
  }

  return result;
}

function email(email) {
  if (!validator.isEmail(email)) {
    errors.invalidEmail(email);
  }

  const opt = {
    all_lowercase: true,
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    gmail_convert_googlemaildotcom: true,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false,
  };

  email = validator.normalizeEmail(email, opt);

  return email;
}

//check, format and return Brazilian phone or error
function phoneNumberBR(number, isMobile) {
  const result = formatPhoneBR(number, isMobile);
  if (!result) {
    errors.invalidPhoneNumber(number, isMobile);
  }

  return result;
}

//check, format and return money value or error
function moneyNumber(value) {
  const result = +parseFloat(value).toFixed(2);

  //invalid number error
  isNaN(result) && errors.numberIsNaN('value', value);

  //number less than minimum
  const min = 0.01;
  result < min && errors.numberLessMinimum('value', value, min);

  return result;
}

//check, format and return account number or error
function accountNumber(account) {
  const result = parseInt(account);

  //invalid number error
  isNaN(result) && errors.numberIsNaN('account', account);

  //number outside range error
  const min = 100000000;
  const max = 999999999;
  result < min && errors.numberLessMinimum('account', account, min);
  result > max && errors.numberGreaterMaximum('account', account, max);

  return result;
}

function accountParam(reqParams) {
  //check body and load account
  errors.requiredParams(reqParams);
  let { account } = reqParams;

  //check required fields
  errors.requiredFields({ account });

  //check and format account number
  const result = accountNumber(account);

  return result;
}

export default {
  cpf,
  email,
  phoneNumberBR,
  moneyNumber,
  accountNumber,
  accountParam,
};
