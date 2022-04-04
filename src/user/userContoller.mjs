import express from 'express';
import userService from './userService.mjs';
import authMiddleware from '../middleware/authHandler.mjs';

const userRouter = express.Router();

userRouter.post('/', userService.create);
userRouter.post('/login', userService.login);
userRouter.get('/', authMiddleware, userService.list);
userRouter.delete('/:userId', authMiddleware, userService.delete);

export default userRouter;
