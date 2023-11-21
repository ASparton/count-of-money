import {
	deleteAllFeeds,
	exampleArticles,
	populateArticles,
	populateFeeds,
} from 'prisma/seedingOperatons';
import { database } from 'src/lucia';
import request from 'supertest';
import app from '../../src/app';

describe('Articles router tests', () => {
	describe('GET all articles', () => {
		beforeAll(async () => {
			await populateFeeds(database);
			await populateArticles(database);
		});

		test('GET all articles without keywords', async () => {
			const res = await request(app).get('/api/articles');
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with ignored params', async () => {
			const res = await request(app).get(
				'/api/articles?date=2023-10-10&orderBy=desc'
			);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with empty keywords', async () => {
			const res = await request(app).get('/api/articles?keywords=');
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleArticles))
			);
		});

		test('GET all articles with one existing keyword', async () => {
			const res = await request(app).get('/api/articles?keywords=bitcoin');
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(
					JSON.stringify(
						exampleArticles.filter(
							(article) => article.id === '2' || article.id === '3'
						)
					)
				)
			);
		});

		test('GET all articles with multiple existing keywords', async () => {
			const res = await request(app).get(
				'/api/articles?keywords=bitcoin;wallet'
			);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(
					JSON.stringify(
						exampleArticles.filter(
							(article) =>
								article.id === '1' || article.id === '2' || article.id === '3'
						)
					)
				)
			);
		});

		test('GET all articles with non existing keywords', async () => {
			const res = await request(app).get('/api/articles?keywords=alexismoins');
			expect(res.body).toStrictEqual([]);
		});

		afterAll(async () => {
			await deleteAllFeeds(database);
		});
	});
});
