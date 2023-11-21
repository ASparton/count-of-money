import express from 'express';
import ApiErrors, { APIError } from '~apiErrors';
import HttpStatusCode from '#types/HttpStatusCode';
import AllArticlesDTO from '#types/dto/articles/AllArticlesDTO';
import OneArticleDTO from '#types/dto/articles/OneArticleDTO';
import { findArticleById, findArticles } from '../database/articles';

const controller = express.Router();

controller.get('/', async (req, res) => {
	let keywords: string[] = [];
	const queryParams = AllArticlesDTO.safeParse(req.query);
	if (queryParams.success)
		keywords = getKeywordsFromQueryParam(queryParams.data.keywords);

	const articles = await findArticles(keywords);
	return res.status(HttpStatusCode.OK_200).send(articles);
});

controller.get('/:id', async (req, res) => {
	const urlParams = OneArticleDTO.parse(req.params);
	const article = await findArticleById(urlParams.id);
	if (article === null) throw new APIError(ApiErrors.RESOURCE_NOT_FOUND, 404);
	return res.status(HttpStatusCode.OK_200).send(article);
});

function getKeywordsFromQueryParam(keywordsParam: string): string[] {
	return keywordsParam.split(';');
}

export default controller;
