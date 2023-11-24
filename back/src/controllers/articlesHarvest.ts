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
	const createdArticles: Article[] = [];
	for (const feed of feeds) {
		const fetchedFeedArticles = await parseRSSFeed(feed.url);
		createManyArticles(feed.id, fetchedFeedArticles).catch((err) => {
			console.log(err);
		});
	}
	return res.status(HttpStatusCode.CREATED_201).send(createdArticles);
});

export default controller;
