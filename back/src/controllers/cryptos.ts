import HttpStatusCode from '#types/HttpStatusCode';

import UrlParamIdDTO from '#types/dto/UrlParamIdDTO';
import UrlQueryIdListDTO from '#types/dto/UrlQueryIdListDTO';

import express from 'express';
import useCrypto from '@composables/useCrypto';

import CreateCryptoDto from '#types/dto/cryptos/CreateCryptoDTO';
import UpdateCryptoDto from '#types/dto/cryptos/UpdateCryptoDTO';

import {
	createCrypto,
	deleteCryptoById,
	updateCryptoById,
	findManyCryptosById,
	findAllVisibleCryptos,
} from '@database/cryptos';

import { adminRoleRequired, authenticationRequired } from '~middlewares';

const { getAllCrypto } = useCrypto();
const controller = express.Router();

controller.get('/', async (req, res) => {
	const query = UrlQueryIdListDTO.parse(req.query);
	const currency = req.lucia ? req.lucia.user.currency : 'EUR';

	const cryptos = query.ids
		? await findManyCryptosById(query.ids)
		: await findAllVisibleCryptos();

	const tickers = cryptos.map((crypto) => `${crypto.api_id}/${currency}`);

	if (tickers.length === 0) {
		return res.status(HttpStatusCode.OK_200).json([]);
	}

	return res.status(HttpStatusCode.OK_200).send(await getAllCrypto(tickers));
});

// controller.get('/:id', async (req, res) => {
// 	const urlParams = UrlParamIdDTO.parse(req.params);
// 	const body = UpdateFeedDto.parse(req.body);
// 	return res
// 		.status(HttpStatusCode.OK_200)
// 		.send(await updateFeedById(urlParams.id, body.minArticlesCount));
// });

// controller.get('/:id/history/:period', async (req, res) => {
// 	const urlParams = UrlParamIdDTO.parse(req.params);
// 	const body = UpdateFeedDto.parse(req.body);
// 	return res
// 		.status(HttpStatusCode.OK_200)
// 		.send(await updateFeedById(urlParams.id, body.minArticlesCount));
// });

controller.post(
	'/',
	authenticationRequired,
	adminRoleRequired,
	async (req, res) => {
		const body = CreateCryptoDto.parse(req.body);
		const createdCrypto = await createCrypto({
			name: body.name,
			api_id: body.apiId,
			logo_url: body.logoUrl,
			visible: body.visible,
		});
		return res.status(HttpStatusCode.CREATED_201).send(createdCrypto);
	},
);

controller.put(
	'/:id',
	authenticationRequired,
	adminRoleRequired,
	async (req, res) => {
		const urlParams = UrlParamIdDTO.parse(req.params);
		const body = UpdateCryptoDto.parse(req.body);
		const createdCrypto = await updateCryptoById(urlParams.id, {
			name: body.name,
			api_id: body.apiId,
			logo_url: body.logoUrl,
			visible: body.visible,
		});
		return res.status(HttpStatusCode.OK_200).send(createdCrypto);
	},
);

controller.delete(
	'/:id',
	authenticationRequired,
	adminRoleRequired,
	async (req, res) => {
		const urlParams = UrlParamIdDTO.parse(req.params);
		return res
			.status(HttpStatusCode.OK_200)
			.send(await deleteCryptoById(urlParams.id));
	},
);

export default controller;
