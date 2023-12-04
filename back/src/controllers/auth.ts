import express from 'express';

import { auth, githubAuth } from '~lucia';

import HttpStatusCode from '#types/HttpStatusCode';
import useGithubAuth from '@composables/useGithubAuth';
import LoginDTO from '@dto/auth/LoginDTO';
import RegisterDTO from '@dto/auth/RegisterDTO';
import ApiErrors, { APIError } from '~apiErrors';

const { isOAuthStateValid, getOrCreateGithubUser } = useGithubAuth();

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

controller.get('/github', async (req, res) => {
	const [url, state] = await githubAuth.getAuthorizationUrl();
	res.cookie('github_oauth_state', state, {
		httpOnly: true,
		secure: false,
		path: '/',
		maxAge: 60 * 60 * 1000, // 1 hour
	});
	return res.status(302).setHeader('Location', url.toString()).end();
});

controller.get('/github/callback', async (req, res) => {
	if (!isOAuthStateValid(req))
		throw new APIError(
			ApiErrors.OAUTH_REQUEST_ERROR,
			HttpStatusCode.BAD_REQUEST_400,
		);

	const githubCode = req.query.code as string;
	const user = await getOrCreateGithubUser(githubCode);
	const session = await auth.createSession({
		userId: user.userId,
		attributes: {},
	});
	return res
		.cookie('session', session.sessionId)
		.cookie(
			'user',
			JSON.stringify({
				id: user.userId,
				email: user.email,
				username: user.username,
				currency: user.currency,
				is_admin: user.is_admin,
			}),
		)
		.redirect('/api/articles');
});

export default controller;
