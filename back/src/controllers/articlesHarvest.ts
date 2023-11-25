import HttpStatusCode from '#types/HttpStatusCode';
import useArticlesHarvest from '@composables/useArticlesHarvest';
import { createManyArticles } from '@database/articles';
import { findAllFeeds } from '@database/feeds';
import { Article } from '@prisma/client';
import express from 'express';

const controller = express.Router();
const { parseRSSFeed } = useArticlesHarvest();

controller.post('/', async (req, res) => {
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
	return res.status(HttpStatusCode.CREATED_201).send(nbArticlesCreated);
});

export default controller;
