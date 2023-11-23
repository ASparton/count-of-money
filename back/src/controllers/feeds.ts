import express from 'express';
import HttpStatusCode from '#types/HttpStatusCode';
import UrlParamIdDTO from '#types/dto/UrlParamIdDTO';
import UpdateFeedDto from '#types/dto/feeds/UpdateFeedDTO';
import {
	deleteFeedById,
	findAllFeeds,
	updateFeedById,
} from '../database/feeds';

const controller = express.Router();

controller.get('/', async (req, res) => {
	return res.status(HttpStatusCode.OK_200).send(await findAllFeeds());
});

controller.put('/:id', async (req, res) => {
	const urlParams = UrlParamIdDTO.parse(req.params);
	const body = UpdateFeedDto.parse(req.body);
	return res
		.status(HttpStatusCode.OK_200)
		.send(await updateFeedById(urlParams.id, body.minArticlesCount));
});

controller.delete('/:id', async (req, res) => {
	const urlParams = UrlParamIdDTO.parse(req.params);
	return res
		.status(HttpStatusCode.OK_200)
		.send(await deleteFeedById(urlParams.id));
});

export default controller;
