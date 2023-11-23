import HttpStatusCode from '#types/HttpStatusCode';
import AllArticlesDTO from '#types/dto/articles/AllArticlesDTO';
import urlParamIdDTO from '#types/dto/urlParamIdDTO';
import { Article } from '@prisma/client';
import express from 'express';
import ApiErrors, { APIError } from '~apiErrors';
import { isAuthenticated } from '~middlewares';
import {
	findArticleById,
	findArticlesByKeywords,
	findCountRestrictedArticles,
} from '../database/articles';

const controller = express.Router();

controller.get('/', isAuthenticated, async (req, res) => {
	let articlesFound: Article[] = [];

	if (req.cookies._isAuth) {
		let keywords: string[] = [];
		const queryParams = AllArticlesDTO.safeParse(req.query);
		if (queryParams.success)
			keywords = getKeywordsFromQueryParam(queryParams.data.keywords);

		articlesFound = await findArticlesByKeywords(keywords);
	} else articlesFound = await findCountRestrictedArticles();

	return res.status(HttpStatusCode.OK_200).send(articlesFound);
});

controller.get('/:id', async (req, res) => {
	const urlParams = urlParamIdDTO.parse(req.params);
	const article = await findArticleById(urlParams.id);
	if (article === null) throw new APIError(ApiErrors.RESOURCE_NOT_FOUND, 404);
	return res.status(HttpStatusCode.OK_200).send(article);
});

function getKeywordsFromQueryParam(keywordsParam: string): string[] {
	return keywordsParam.split(';');
}

export default controller;
