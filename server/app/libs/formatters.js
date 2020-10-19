import glpn from 'google-libphonenumber';
import validations from './validators.js';

function formatCpf(cpf) {
  if (!validations.isCpf(cpf)) return '';

  let result = cpf.replace(/[^\d]+/g, '');

  result =
    result.substr(0, 3) +
    '.' +
    result.substr(3, 3) +
    '.' +
    result.substr(6, 3) +
    '-' +
    result.substr(9, 2);
  return result;
}

function formatPhoneBR(number, isMobile) {
  if (
    (isMobile && validations.isMobilePhoneBR(number)) ||
    (!isMobile && validations.isLandlinePhoneBR(number))
  ) {
    const PNF = glpn.PhoneNumberFormat;
    const phoneUtil = glpn.PhoneNumberUtil.getInstance();
    const phone = phoneUtil.parse(number, 'BR');
    return phoneUtil.format(phone, PNF.NATIONAL);
  }
}

function formatName(string) {
  let words = string.trim().toLowerCase().replace(/  +/g, ' ').split(' ');
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    words[i] = w[0].toUpperCase() + w.slice(1);
  }
  return words.join(' ');
}

export { formatCpf, formatPhoneBR, formatName };
