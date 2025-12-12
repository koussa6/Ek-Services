import express from 'express';
import { login, register } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import { loginValidation, registerValidation } from '../validators/auth.js';
import { validate } from '../middleware/validate.js';

const userRouter = express.Router();

userRouter.post('/signUp', registerValidation, validate, register);
userRouter.post('/login', loginValidation, validate, login);
export default userRouter;
