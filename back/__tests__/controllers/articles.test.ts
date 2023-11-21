import {
	deleteAllFeeds,
	exampleArticles,
	populateArticles,
	populateFeeds,
} from 'prisma/seedingOperatons';
import { database } from 'src/lucia';
import request from 'supertest';
import app from '../../src/app';
import HttpStatusCode from '#types/HttpStatusCode';
import ApiErrors from '~apiErrors';

describe('Articles router tests', () => {
	describe('GET all articles', () => {
		beforeAll(async () => {
			await populateFeeds(database);
			await populateArticles(database);
		});

		test('GET all articles without keywords', async () => {
			const res = await request(app).get('/api/articles');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with ignored params', async () => {
			const res = await request(app).get(
				'/api/articles?date=2023-10-10&orderBy=desc'
			);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with empty keywords', async () => {
			const res = await request(app).get('/api/articles?keywords=');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with one existing keyword', async () => {
			const res = await request(app).get('/api/articles?keywords=bitcoin');
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
			const res = await request(app).get(
				'/api/articles?keywords=bitcoin;wallet'
			);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(
					JSON.stringify(exampleArticles.filter((article) => article.id < 4))
				)
			);
		});

		test('GET all articles with non existing keywords', async () => {
			const res = await request(app).get('/api/articles?keywords=alexismoins');
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
