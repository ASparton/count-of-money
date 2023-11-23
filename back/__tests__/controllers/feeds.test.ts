import HttpStatusCode from '#types/HttpStatusCode';
import {
	deleteAllFeeds,
	deleteAllUsers,
	exampleFeeds,
	populateFeeds,
} from 'prisma/seedingOperatons';
import { database } from 'src/lucia';
import request from 'supertest';
import app from '../../src/app';

let authToken = '';
let registeredUserId = '';

describe('Feeds controller tests', () => {
	describe('GET all feeds', () => {
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

		test('GET all feeds unauthenticated', async () => {
			const res = await request(app).get('/api/feeds');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORIZED_401);
		});

		test('GET all feeds authenticated as non admin', async () => {
			const res = await request(app)
				.get('/api/feeds')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN_403);
		});

		test('GET all feeds authenticated as admin', async () => {
			await setRegisteredUserAdmin(registeredUserId);
			const res = await request(app)
				.get('/api/feeds')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(exampleFeeds))
			);
		});

		afterAll(async () => {
			await deleteAllFeeds(database);
			await deleteAllUsers(database);
		});
	});

	describe('PUT feed by id', () => {
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

		test('PUT feed unauthenticated', async () => {
			const res = await request(app).put('/api/feeds/1').send({
				minArticlesCount: 10,
			});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORIZED_401);
		});

		test('PUT feed authenticated as non admin', async () => {
			const res = await request(app)
				.put('/api/feeds/1')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					minArticlesCount: 10,
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN_403);
		});

		test('PUT feed authenticated as admin', async () => {
			const expectedFeed = exampleFeeds[0];
			expectedFeed.min_articles_count = 10;
			await setRegisteredUserAdmin(registeredUserId);
			const res = await request(app)
				.put('/api/feeds/1')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					minArticlesCount: 10,
				});
			// Assert response
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedFeed))
			);

			// Assert database update
			const updatedFeed = await database.feed.findUnique({
				where: {
					id: 1,
				},
			});
			expect(JSON.parse(JSON.stringify(updatedFeed))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedFeed))
			);
		});

		test('PUT feed with non existing id', async () => {
			const res = await request(app)
				.put('/api/feeds/0')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					minArticlesCount: 10,
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.NOT_FOUND_404);
		});

		test('PUT feed with invalid id format', async () => {
			const res = await request(app)
				.put('/api/feeds/nzendiezn')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					minArticlesCount: 10,
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		afterAll(async () => {
			await deleteAllFeeds(database);
			await deleteAllUsers(database);
		});
	});

	describe('DELETE feed by id', () => {
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

		test('DELETE feed unauthenticated', async () => {
			const res = await request(app).delete('/api/feeds/1');
			expect(res.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORIZED_401);
		});

		test('DELETE feed authenticated as non admin', async () => {
			const res = await request(app)
				.delete('/api/feeds/1')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN_403);
		});

		test('DELETE feed authenticated as admin', async () => {
			await setRegisteredUserAdmin(registeredUserId);
			const res = await request(app)
				.delete('/api/feeds/1')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);

			const deletedFeed = await database.feed.findUnique({
				where: {
					id: 1,
				},
			});
			expect(deletedFeed).toBeNull();
		});

		test('DELETE feed with non existing id', async () => {
			const res = await request(app)
				.delete('/api/feeds/0')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.NOT_FOUND_404);
		});

		test('DELETE feed with invalid id format', async () => {
			const res = await request(app)
				.delete('/api/feeds/nzendiezn')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		afterAll(async () => {
			await deleteAllFeeds(database);
			await deleteAllUsers(database);
		});
	});
});

async function setRegisteredUserAdmin(userId: string) {
	await database.user.update({
		where: {
			id: userId,
		},
		data: {
			is_admin: true,
		},
	});
}
