import HttpStatusCode from '#types/HttpStatusCode';
import UrlParamIdDTO from '#types/dto/UrlParamIdDTO';
import useArticlesHarvest from '@composables/useArticlesHarvest';
import { createManyArticles } from '@database/articles';
import { findAllFeeds, findFeedById } from '@database/feeds';
import express from 'express';

const controller = express.Router();
const { parseRSSFeed } = useArticlesHarvest();

controller.post('/', async (req, res) => {
	const nbArticlesCreated = await harvestFromAllFeedsAndInsert();
	return res.status(HttpStatusCode.CREATED_201).send(nbArticlesCreated);
});

controller.post('/:id', async (req, res) => {
	const urlParams = UrlParamIdDTO.parse(req.params);
	const feedToHarvestFrom = await findFeedById(urlParams.id);
	const fetchedFeedArticles = await parseRSSFeed(feedToHarvestFrom.url);
	const nbArticlesCreated = await createManyArticles(
		feedToHarvestFrom.id,
		fetchedFeedArticles,
	);
	return res.status(HttpStatusCode.CREATED_201).send(nbArticlesCreated);
});

export async function harvestFromAllFeedsAndInsert(): Promise<{
	count: number;
}> {
	const feeds = await findAllFeeds();
	const nbArticlesCreated = {
		count: 0,
	};
	for (const feed of feeds) {
		const fetchedFeedArticles = await parseRSSFeed(feed.url);
		nbArticlesCreated.count += (
			await createManyArticles(feed.id, fetchedFeedArticles)
		).count;
	}
	return nbArticlesCreated;
}

export default controller;
