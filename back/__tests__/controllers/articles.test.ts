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

describe('Articles router tests', () => {
	beforeAll(async () => {
		await deleteAllUsers(database);
	});

	describe('GET all articles', () => {
		beforeAll(async () => {
			await populateFeeds(database);
			await populateArticles(database);
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

		test('GET all articles with keywords unauthenticated', async () => {
			const res = await request(app).get('/api/articles?keyworkds=bitcoin');
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

		test('GET all articles without keywords', async () => {
			const res = await request(app)
				.get('/api/articles')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with ignored params', async () => {
			const res = await request(app)
				.get('/api/articles?date=2023-10-10&orderBy=desc')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with empty keywords', async () => {
			const res = await request(app)
				.get('/api/articles?keywords=')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with one existing keyword', async () => {
			const res = await request(app)
				.get('/api/articles?keywords=bitcoin')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(
					JSON.stringify(
						exampleArticles.filter(
							(article) => article.id === 2 || article.id === 3
						)
					)
				)
			);
		});

		test('GET all articles with multiple existing keywords', async () => {
			const res = await request(app)
				.get('/api/articles?keywords=bitcoin;wallet')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(
					JSON.stringify(exampleArticles.filter((article) => article.id < 4))
				)
			);
		});

		test('GET all articles with non existing keywords', async () => {
			const res = await request(app)
				.get('/api/articles?keywords=alexismoins')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(res.body).toStrictEqual([]);
		});

		afterAll(async () => {
			await deleteAllFeeds(database);
		});
	});

	describe('GET one article', () => {
		beforeAll(async () => {
			await populateFeeds(database);
			await populateArticles(database);
		});

		test('GET one article with wrong id format', async () => {
			const res = await request(app).get('/api/articles/three');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		test('GET one article with unexisting id', async () => {
			const res = await request(app).get('/api/articles/-1');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.NOT_FOUND_404);
		});

		test('GET one existing article', async () => {
			const res = await request(app).get('/api/articles/1');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles[0]))
			);
		});

		afterAll(async () => {
			await deleteAllFeeds(database);
		});
	});
});
