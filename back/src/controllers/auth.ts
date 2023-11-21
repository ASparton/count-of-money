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
	const body = RegisterDTO.safeParse(req.body);

	if (!body.success) {
		return res.send(body.error.issues);
	}

	const user = await auth.createUser({
		key: {
			providerId: 'email',
			providerUserId: body.data.email,
			password: body.data.password,
		},
		attributes: {
			email: body.data.email,
			username: body.data.username,
		},
	});

	const session = await auth.createSession({
		userId: user.userId,
		attributes: {},
	});

	return res.status(HttpStatusCode.OK_200).send({
		user: {
			id: user.userId,
			email: body.data.email,
		},
		token: session.sessionId,
	});
});

export default controller;
