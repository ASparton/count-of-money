import { populateArticles, exampleArticles } from '../../prisma/seed';
import app from '../../src';
import request from 'supertest';

describe('Articles router tests', () => {
	describe('GET all articles', () => {
			// First populate articles to fetch
			populateArticles()
				.then(() => {
					test('GET all articles without keywords', async () => {
						const res = await request(app).get('/articles');
						expect(res.body).toBe(exampleArticles);
					});
				})
		});

});
