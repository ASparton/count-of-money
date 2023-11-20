import express from 'express';

import { auth } from '~lucia';

import LoginDTO from '@dto/auth/LoginDTO';
import RegisterDTO from '@dto/auth/RegisterDTO';

const controller = express.Router();

controller.post('/login', async (req, res) => {
	const body = LoginDTO.safeParse(req.body);

	if (!body.success) {
		return;
	}

	const key = await auth.useKey('email', body.data.email, body.data.password);

	const session = await auth.createSession({
		userId: key.userId,
		attributes: {},
	});

	const handler = auth.handleRequest(req, res);
	handler.setSession(session);

	return res.status(200).send({
		success: true,
	});
});

controller.post('/register', async (req, res) => {
	const body = RegisterDTO.safeParse(req.body);

	if (!body.success) {
		return;
	}

	const user = await auth.createUser({
		key: {
			providerId: 'email',
			providerUserId: body.data.email,
			password: body.data.password,
		},
		attributes: {
			email: body.data.email,
		},
	});

	const session = await auth.createSession({
		userId: user.userId,
		attributes: {},
	});

	const handler = auth.handleRequest(req, res);
	handler.setSession(session);

	return res.status(302).setHeader('Location', '/').end();
});

export default controller;
