import express from 'express';
import controller from '../controllers/authController.js';
import { uploadPDF } from '../libs/fileManager.js';

const router = express.Router();

//create user
router.post('/register', uploadPDF.single('file'), controller.createUser);

//create authentication
router.post('/login', controller.logIn);

//remove authentication
router.post('/logout', controller.logOut);

//create forgot password
router.post('/forgot_password', controller.forgotPass);

//create reset password
router.post('/reset_password', controller.resetPass);

export { router as authRouter };
