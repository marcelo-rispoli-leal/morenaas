import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import controller from '../controllers/movieController.js';

const router = express.Router();
router.use(authMiddleware);

//all users access
router.get('/list', controller.findAll());
router.get('/list/available', controller.findAll('available'));

//customer access
router.post('/rent', controller.rentMovies);
router.post('/return', controller.returnMovies);

//worker access only
router.post('/register', controller.createMovie);
router.post('/tape', controller.createTape);
router.get('/list/rented', controller.findAll('rented'));

export { router as movieRouter };
