import express from 'express';
import { createUser, getUserById } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import { createUserSchema, getUserByIdSchema } from '../schemas/user.schema.js';

export const userRouter = express.Router();

userRouter.post('/', validate(createUserSchema), createUser);
userRouter.get('/:id', validate(getUserByIdSchema), getUserById);
