import express from 'express';
import HttpStatusCode from '#types/HttpStatusCode';
import { findAllFeeds } from '../database/feeds';

const controller = express.Router();

controller.get('/', async (req, res) => {
	return res.status(HttpStatusCode.OK_200).send(await findAllFeeds());
});

export default controller;
