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
