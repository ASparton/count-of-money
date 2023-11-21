import HttpStatusCode from '#types/HttpStatusCode';
import express from 'express';

import { auth } from '~lucia';

const controller = express.Router();

controller.post('/logout', async (req, res) => {
	await auth.invalidateSession(req.lucia.sessionId);
	res.send(HttpStatusCode.OK_200);
});

export default controller;
