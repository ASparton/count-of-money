import express from 'express';
import HttpStatusCode from '#types/HttpStatusCode';
import { deleteFeedById, findAllFeeds } from '../database/feeds';
import urlParamIdDTO from '#types/dto/urlParamIdDTO';

const controller = express.Router();

controller.get('/', async (req, res) => {
	return res.status(HttpStatusCode.OK_200).send(await findAllFeeds());
});

controller.delete('/:id', async (req, res) => {
	const urlParams = urlParamIdDTO.parse(req.params);
	return res
		.status(HttpStatusCode.OK_200)
		.send(await deleteFeedById(urlParams.id));
});

export default controller;
