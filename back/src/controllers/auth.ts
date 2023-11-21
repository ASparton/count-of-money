import express from 'express';

import { auth } from '~lucia';

import LoginDTO from '@dto/auth/LoginDTO';
import RegisterDTO from '@dto/auth/RegisterDTO';
import HttpStatusCode from '#types/HttpStatusCode';

const controller = express.Router();

controller.post('/login', async (req, res) => {
	const body = LoginDTO.safeParse(req.body);

	if (!body.success) {
		return res.send(body.error.issues);
	}

	const key = await auth.useKey('email', body.data.email, body.data.password);

	const session = await auth.createSession({
		userId: key.userId,
		attributes: {},
	});

	return res.status(HttpStatusCode.OK_200).send({
		user: {
			id: key.userId,
			email: body.data.email,
		},
		token: session.sessionId,
	});
});

controller.post('/register', async (req, res) => {
	const body = RegisterDTO.parse(req.body);

	const user = await auth.createUser({
		key: {
			providerId: 'email',
			providerUserId: body.email,
			password: body.password,
		},
		attributes: {
			email: body.email,
			username: body.username,
			currency: body.currency as string,
			is_admin: false,
		},
	});

	const session = await auth.createSession({
		userId: user.userId,
		attributes: {},
	});

	return res.status(HttpStatusCode.OK_200).send({
		user: {
			id: user.userId,
			email: user.email,
			username: user.username,
			currency: user.currency,
			is_admin: user.is_admin,
		},
		token: session.sessionId,
	});
});

export default controller;
