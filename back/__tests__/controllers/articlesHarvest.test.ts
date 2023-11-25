import HttpStatusCode from '#types/HttpStatusCode';
import {
	deleteAllFeeds,
	deleteAllUsers,
	populateFeeds,
	setRegisteredUserAdmin,
} from 'prisma/seedingOperatons';
import { database } from 'src/lucia';
import request from 'supertest';
import app from '../../src/app';

let authToken = '';
let registeredUserId = '';

describe('Articles controller tests', () => {
	beforeAll(async () => {
		await deleteAllUsers(database);
		await deleteAllFeeds(database);
	});

	describe('POST articles harvest', () => {
		beforeAll(async () => {
			await populateFeeds(database);
			const res = await request(app).post('/api/users/register').send({
				email: 'alexis.moins@epitech.eu',
				password: 'mySecretPassword',
				username: 'Alexis',
			});
			authToken = res.body.token;
			registeredUserId = res.body.user.id;
		});

		test('POST articles harvest without unauthenticated', async () => {
			const res = await request(app).post('/api/articles/harvest');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORIZED_401);
		});

		test('POST articles harvest authenticated as non admin', async () => {
			const res = await request(app)
				.post('/api/articles/harvest')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN_403);
		});

		test('POST articles harvest authenticated as admin', async () => {
			await setRegisteredUserAdmin(database, registeredUserId);
			const res = await request(app)
				.post('/api/articles/harvest')
				.set('Authorization', `Bearer ${authToken}`);

			// Assert response
			expect(res.statusCode).toStrictEqual(HttpStatusCode.CREATED_201);
			expect(res.body.count).toBeGreaterThan(0);

			// Assert database insertions
			const nbInsertedArticles = (await database.article.count()).valueOf();
			expect(nbInsertedArticles).toStrictEqual(res.body.count);
		});

		afterAll(async () => {
			await deleteAllFeeds(database);
			await deleteAllUsers(database);
		});
	});
});
