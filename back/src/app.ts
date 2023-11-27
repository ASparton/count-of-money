import express from 'express';
import 'express-async-errors';

import cors from 'cors';

import articles from '@controllers/articles';
import auth from '@controllers/auth';
import feeds from '@controllers/feeds';
import users from '@controllers/users';
import cryptos from '@controllers/cryptos';

import {
	adminRoleRequired,
	authenticationRequired,
	errorHandler,
	logger,
} from '~middlewares';

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);

app.use('/api/users/', auth, authenticationRequired, users);
app.use('/api/feeds', authenticationRequired, adminRoleRequired, feeds);
app.use('/api/articles', articles);
app.use('/api/cryptos', cryptos);

app.use(errorHandler);

export default app;
