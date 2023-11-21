import express, { query } from 'express';
import { findArticles } from '../database/articles';
import HttpStatusCode from '#types/HttpStatusCode';
import AllArticlesDTO from '#types/dto/articles/AllArticlesDTO';

const controller = express.Router();

controller.get('/', async (req, res) => {
	let keywords: string[] = [];
	const queryParams = AllArticlesDTO.safeParse(req.query);
	if (queryParams.success)
		keywords = getKeywordsFromQueryParam(queryParams.data.keywords);

	const articles = await findArticles(keywords);
	return res.status(HttpStatusCode.OK_200).send(articles);
});

function getKeywordsFromQueryParam(keywordsParam: string): string[] {
	return keywordsParam.split(';');
}

export default controller;
