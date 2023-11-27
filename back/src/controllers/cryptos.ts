import HttpStatusCode from '#types/HttpStatusCode';

import UrlParamIdDTO from '#types/dto/UrlParamIdDTO';
import UrlQueryIdListDTO from '#types/dto/UrlQueryIdListDTO';

import CreateFeedDTO from '#types/dto/feeds/CreateFeedDTO';
import UpdateFeedDto from '#types/dto/feeds/UpdateFeedDTO';

import express from 'express';
import useCrypto from '@composables/useCrypto';

import { findManyCryptosById, findAllVisibleCryptos } from '@database/cryptos';

const { getAllCrypto } = useCrypto();
const controller = express.Router();

controller.get('/', async (req, res) => {
	const query = UrlQueryIdListDTO.parse(req.query);

	const currency = req.lucia ? req.lucia.user.currency : 'EUR';

	const cryptos = query.ids
		? await findManyCryptosById(query.ids)
		: await findAllVisibleCryptos();

	const tickers = cryptos.map((crypto) => `${crypto.api_id}/${currency}`);
	return res.status(HttpStatusCode.OK_200).send(await getAllCrypto(tickers));
});

controller.get('/:id', async (req, res) => {
	const urlParams = UrlParamIdDTO.parse(req.params);
	const body = UpdateFeedDto.parse(req.body);
	return res
		.status(HttpStatusCode.OK_200)
		.send(await updateFeedById(urlParams.id, body.minArticlesCount));
});

controller.get('/:id/history/:period', async (req, res) => {
	const urlParams = UrlParamIdDTO.parse(req.params);
	const body = UpdateFeedDto.parse(req.body);
	return res
		.status(HttpStatusCode.OK_200)
		.send(await updateFeedById(urlParams.id, body.minArticlesCount));
});

controller.post('/', async (req, res) => {
	const body = CreateFeedDTO.parse(req.body);
	const createdFeed = await createFeed({
		url: body.url,
		min_articles_count: body.minArticlesCount,
	});
	return res.status(HttpStatusCode.CREATED_201).send(createdFeed);
});

controller.delete('/:id', async (req, res) => {
	const urlParams = UrlParamIdDTO.parse(req.params);
	return res
		.status(HttpStatusCode.OK_200)
		.send(await deleteFeedById(urlParams.id));
});

export default controller;
