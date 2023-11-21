import express from 'express';
import 'express-async-errors';

import cors from 'cors';

import auth from '@controllers/auth';
import users from '@controllers/users';

import { errorHandler, isAuthenticated, logger } from '~middlewares';

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);

app.use('/api/users/', auth, isAuthenticated, users);

app.use(errorHandler);

export default app;
