import HttpStatusCode from '#types/HttpStatusCode';
import express from 'express';

import { auth } from '~lucia';
import { findUserById } from '@database/users';

const controller = express.Router();

controller.post('/logout', async (req, res) => {
	await auth.invalidateSession(req.lucia.sessionId);
	res.status(HttpStatusCode.OK_200).send();
});

controller.get('/profile', async (req, res) => {
	const user = await findUserById(req.lucia.user.userId);

	if (!user) {
		throw new Error('lol looser');
	}

	res.status(HttpStatusCode.OK_200).json({ user });
});

export default controller;
