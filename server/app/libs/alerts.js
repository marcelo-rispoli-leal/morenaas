import { formatPhoneBR } from './formatters.js';

//formats valid phones and or alerts invalid numbers
const phoneNotRecorded = (mobile, landline) => {
  //declares initial constants and variables
  let alert = undefined;
  const alertPrefix = `was not recorded because it is not a valid Brazilian`;
  const alertSuffix = `phone number according to Google rules.`;

  //checks and formats mobile phone number or adds alert if invalid
  let tempPhone = formatPhoneBR(mobile, true);
  if (mobile !== undefined && tempPhone === undefined) {
    alert = {
      mobile: `'${mobile}' ${alertPrefix} mobile ${alertSuffix}`,
    };
  }
  mobile = tempPhone;

  //checks and formats landline phone number or adds alert if invalid
  tempPhone = formatPhoneBR(landline, false);
  if (landline !== undefined && tempPhone === undefined) {
    alert = {
      ...alert,
      landline: `'${landline}' ${alertPrefix} landline ${alertSuffix}`,
    };
  }
  landline = tempPhone;

  //returns phones and alert
  return { mobile, landline, alert };
};

//alerts missing PDF file upload
const userNotUploadPDF = () => {
  let alert = `You didn't upload the PDF file. Client access is `;
  alert += `granted after sending and approving the documentation.`;
  return alert;
};
export default { phoneNotRecorded, userNotUploadPDF };
