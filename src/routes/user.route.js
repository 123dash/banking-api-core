import express from 'express';
import { createUser, getUserById } from '../controllers/user.controller.js';

export const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.get('/:id', getUserById);
