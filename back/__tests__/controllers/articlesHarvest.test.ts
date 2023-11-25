import HttpStatusCode from '#types/HttpStatusCode';
import { Article } from '@prisma/client';
import {
	deleteAllFeeds,
	deleteAllUsers,
	exampleArticles,
	populateArticles,
	populateFeeds,
} from 'prisma/seedingOperatons';
import { database } from 'src/lucia';
import request from 'supertest';
import app from '../../src/app';

let authToken = '';

describe('Articles controller tests', () => {
	beforeAll(async () => {
		await deleteAllUsers(database);
		await deleteAllFeeds(database);
	});

	describe('GET all articles', () => {
		beforeAll(async () => {
			await populateFeeds(database);
			const res = await request(app).post('/api/users/register').send({
				email: 'alexis.moins@epitech.eu',
				password: 'mySecretPassword',
				username: 'Alexis',
			});
			authToken = res.body.token;
		});

		test('GET all articles without keywords unauthenticated', async () => {
			const res = await request(app).get('/api/articles');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			for (const expectedArticle of exampleArticles.filter(
				(article) => article.id !== 5
			)) {
				expect(
					(res.body as Article[]).find(
						(receivedArticle) => receivedArticle.id === expectedArticle.id
					)
				).toBeTruthy();
			}
		});

		afterAll(async () => {
			await deleteAllFeeds(database);
			await deleteAllUsers(database);
		});
	});
});
