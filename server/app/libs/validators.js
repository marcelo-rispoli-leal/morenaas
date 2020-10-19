import glpn from 'google-libphonenumber';

function isCpf(cpfText) {
  // remove non-numeric characters
  const cpf = cpfText.replace(/[^\d]+/g, '');
  if (cpf == '') return false;
  // eliminates known invalid CPFs
  if (
    cpf.length != 11 ||
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
  )
    return false;
  // valid first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let result = 11 - (sum % 11);
  if (result == 10 || result == 11) result = 0;
  if (result != parseInt(cpf.charAt(9))) return false;
  // valid secund digit
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  result = 11 - (sum % 11);
  if (result == 10 || result == 11) result = 0;
  if (result != parseInt(cpf.charAt(10))) return false;
  return true;
}

function isMobilePhoneBR(number) {
  try {
    const phoneUtil = glpn.PhoneNumberUtil.getInstance();
    let phone = phoneUtil.parse(number, 'BR');

    //valid BR phone
    let result = phoneUtil.isValidNumberForRegion(phone, 'BR');

    //valid mobile phone
    if (
      result === true &&
      phoneUtil.getNumberType(phone) !== glpn.PhoneNumberType.MOBILE
    ) {
      result = false;
    }

    return result;
  } catch (err) {
    return false;
  }
}

function isLandlinePhoneBR(number) {
  try {
    const phoneUtil = glpn.PhoneNumberUtil.getInstance();
    let phone = phoneUtil.parse(number, 'BR');

    //valid BR phone
    let result = phoneUtil.isValidNumberForRegion(phone, 'BR');

    //valid mobile phone
    if (
      result === true &&
      phoneUtil.getNumberType(phone) !== glpn.PhoneNumberType.FIXED_LINE
    ) {
      result = false;
    }

    return result;
  } catch (err) {
    return false;
  }
}

export default { isCpf, isMobilePhoneBR, isLandlinePhoneBR };
