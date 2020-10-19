import nodemailer from 'nodemailer';

const { MAILSMTP, MAILPORT, MAILUSER, MAILPASS } = process.env;
const secure = MAILPORT === '465' ? true : false;

const mailer = nodemailer.createTransport({
  host: MAILSMTP,
  port: MAILPORT,
  secure,
  auth: {
    user: MAILUSER,
    pass: MAILPASS,
  },
});

function sendMessage(to, subject, html) {
  mailer.sendMail({ to, subject, html }, (error) => {
    if (error) {
      throw new Error(
        JSON.stringify({
          status: 400,
          error: `Error on send email with subject '${subject}' to address '${to}'.`,
        })
      );
    }
  });
}

const forgotPass = (toUserMail, token) => {
  const mailMessage = {
    to: toUserMail,
    subject: 'Morenaas - Forgot your password?',
    html:
      '<p>Did you forget your password? ' +
      'No problem, to set a new password use the following token:</p>' +
      `<p>${token}</p>` +
      '<p>This token expires in one hour or less with you require another.</p>',
  };

  sendMessage(toUserMail, mailMessage.subject, mailMessage.html);
};

const setedCustomer = (toUserMail) => {
  const mailMessage = {
    to: toUserMail,
    subject: 'Morenaas - Your registration has been approved!',
    html:
      `<p>Your documentation has been approved and you can now rent our movies.</p>` +
      `<p>To use the features reserved for our customers, ` +
      `make a new login of your user in our system.</p>` +
      `<p>To make the best use of our services, follow the ` +
      `instructions in our documentation and keep your data up to date.</p>` +
      `<p>Enjoy our services, we hope to surprise you positively. ` +
      `We wish and do the best for our customers.</p>` +
      `<p>Best regards.</p>`,
  };

  sendMessage(toUserMail, mailMessage.subject, mailMessage.html);
};

const deletedCustomer = (toUserMail, cpf) => {
  const mailMessage = {
    to: toUserMail,
    subject: 'Morenaas - Your user has been deleted',
    html:
      `<p>Your user with CPF ${cpf} has been deleted.</p>` +
      `<p>We hope you will be back soon.</p>` +
      `<p>When you wish, register a new user to be our customer again.</p>` +
      `<p>Best regards.</p>`,
  };

  sendMessage(toUserMail, mailMessage.subject, mailMessage.html);
};

const deletedUser = (toUserMail, cpf) => {
  const mailMessage = {
    to: toUserMail,
    subject: 'Morenaas - Your data and user has been deleted',
    html:
      `<p>Your user with CPF ${cpf} been deleted and ` +
      `your data no longer exists in our system.</p>` +
      `<p>We hope you make a new registration soon.</p>` +
      `<p>Best regards.</p>`,
  };

  sendMessage(toUserMail, mailMessage.subject, mailMessage.html);
};

export default {
  forgotPass,
  setedCustomer,
  deletedUser,
  deletedCustomer,
};
