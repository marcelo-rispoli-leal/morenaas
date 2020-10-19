import jwt from 'jsonwebtoken';
import errors from '../libs/errors.js';
import gets from '../libs/getters.js';

export default async (req, _, next) => {
  try {
    //checks authorization header
    const authHeader = req.headers.authorization;
    errors.jwtAuthHeaderFailure(authHeader);

    //checks token secret
    const token = authHeader.substr(7);
    const SECRET = process.env.SECRET;
    jwt.verify(token, SECRET, (err, decoded) => {
      //token rejected
      if (err) {
        errors.jwtRejected(err.message);
      }

      //token valid, updates request
      req.cpf = decoded.cpf;
      req.worker = decoded.worker;
      req.customer = decoded.customer;
    });
    //checks user token
    const user = await gets.user('CPF', req.cpf, 'token');
    errors.jwtReplaced(token, user.token);

    //token ok, go to requested route
    return next();
  } catch (err) {
    next(err);
  }
};
