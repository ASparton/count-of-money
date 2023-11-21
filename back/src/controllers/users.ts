import HttpStatusCode from '#types/HttpStatusCode';
import express from 'express';

import { auth } from '~lucia';
import UpdateProfileDto from '#types/dto/auth/UpdateProfileDTO';

import { findUserById, updateUser } from '@database/users';
import {
	addCryptoToUser,
	findManyCryptosById,
	removeCryptoFromUser,
} from '@database/cryptos';
import { addKeywordsToUser, removeKeywordsFromUser } from '@database/keywords';

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

controller.put('/profile', async (req, res) => {
	const body = UpdateProfileDto.parse(req.body);

	const userId = req.lucia.user.userId;

	// Ensure cryptos exist
	await findManyCryptosById(body.cryptos);

	// Cryptos
	await removeCryptoFromUser(userId);
	await addCryptoToUser(userId, body.cryptos);

	// Keywords
	await removeKeywordsFromUser(userId);
	await addKeywordsToUser(userId, body.keywords);

	const user = await updateUser(userId, {
		username: body.username,
		currency: body.currency,
	});

	res.status(HttpStatusCode.OK_200).json({ user });
});

export default controller;
