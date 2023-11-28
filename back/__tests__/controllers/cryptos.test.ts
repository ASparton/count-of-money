import HttpStatusCode from '#types/HttpStatusCode';
import {
	deleteAllCryptos,
	deleteAllUsers,
	exampleCryptos,
	populateCryptos,
	setRegisteredUserAdmin,
} from 'prisma/seedingOperatons';
import { database } from 'src/lucia';
import request from 'supertest';
import app from '../../src/app';
import { Crypto } from '@prisma/client';

let authToken = '';
let registeredUserId = '';

describe('Cryptos controller tests', () => {
	describe('POST crypto', () => {
		beforeAll(async () => {
			const res = await request(app).post('/api/users/register').send({
				email: 'alexis.moins@epitech.eu',
				password: 'mySecretPassword',
				username: 'Alexis',
			});
			authToken = res.body.token;
			registeredUserId = res.body.user.id;
		});

		test('POST crypto unauthenticated', async () => {
			const res = await request(app).post('/api/cryptos').send({
				name: 'Bitcoin',
				apiId: 'BTC',
				logoUrl:
					'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
				visible: true,
			});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORIZED_401);
		});

		test('POST crypto authenticated as non admin', async () => {
			const res = await request(app)
				.post('/api/cryptos')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Bitcoin',
					apiId: 'BTC',
					logoUrl:
						'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
					visible: true,
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN_403);
		});

		test('POST crypto authenticated as admin', async () => {
			const expectedCrypto = exampleCryptos[0];
			await setRegisteredUserAdmin(database, registeredUserId);
			const res = await request(app)
				.post('/api/cryptos')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Bitcoin',
					apiId: 'BTC',
					logoUrl:
						'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
					visible: true,
				});
			// Assert response
			expect(res.statusCode).toStrictEqual(HttpStatusCode.CREATED_201);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);

			// Assert database update
			const createdCrypto = await database.crypto.findUnique({
				where: {
					name: expectedCrypto.name,
				},
			});
			expect(JSON.parse(JSON.stringify(createdCrypto))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);
		});

		test('POST crypto authenticated as admin without specifying visible field', async () => {
			const expectedCrypto = exampleCryptos[1];
			await setRegisteredUserAdmin(database, registeredUserId);
			const res = await request(app)
				.post('/api/cryptos')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Etherum',
					apiId: 'ETH',
					logoUrl:
						'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ethereum_logo.svg/1285px-Ethereum_logo.svg.png',
				});
			// Assert response
			expect(res.statusCode).toStrictEqual(HttpStatusCode.CREATED_201);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);

			// Assert database update
			const createdCrypto = await database.crypto.findUnique({
				where: {
					name: expectedCrypto.name,
				},
			});
			expect(JSON.parse(JSON.stringify(createdCrypto))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);
		});

		test('POST crypto with no body', async () => {
			const res = await request(app)
				.post('/api/cryptos')
				.set('Authorization', `Bearer ${authToken}`)
				.send();
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		test('POST crypto with empty body', async () => {
			const res = await request(app)
				.post('/api/cryptos')
				.set('Authorization', `Bearer ${authToken}`)
				.send({});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		test('POST crypto with invalid logo url', async () => {
			const res = await request(app)
				.post('/api/cryptos')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Solana',
					apiId: 'SOL',
					logoUrl: 'http/upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo',
					visible: false,
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		test('POST crypto with existing name', async () => {
			const res = await request(app)
				.post('/api/cryptos')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Bitcoin',
					apiId: 'SOL',
					logoUrl: 'http/upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo',
					visible: false,
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		afterAll(async () => {
			await deleteAllCryptos(database);
			await deleteAllUsers(database);
		});
	});

	describe('PUT crypto by id', () => {
		beforeAll(async () => {
			await populateCryptos(database);
			const res = await request(app).post('/api/users/register').send({
				email: 'alexis.moins@epitech.eu',
				password: 'mySecretPassword',
				username: 'Alexis',
			});
			authToken = res.body.token;
			registeredUserId = res.body.user.id;
		});

		test('PUT crypto unauthenticated', async () => {
			const res = await request(app).put('/api/cryptos/1').send({
				name: 'Bitcoin',
				apiId: 'BTC',
				logoUrl:
					'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
				visible: true,
			});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORIZED_401);
		});

		test('PUT crypto authenticated as non admin', async () => {
			const res = await request(app)
				.put('/api/cryptos/1')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Bitcoin',
					apiId: 'BTC',
					logoUrl:
						'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
					visible: true,
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN_403);
		});

		test('PUT crypto authenticated as admin only visible field', async () => {
			const expectedCrypto = exampleCryptos[0];
			expectedCrypto.visible = false;
			await setRegisteredUserAdmin(database, registeredUserId);
			const res = await request(app)
				.put('/api/cryptos/1')
				.set('Authorization', `Bearer ${authToken}`)
				.send({ visible: false });
			// Assert response
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);

			// Assert database update
			const updatedCrypto = await database.crypto.findUnique({
				where: {
					id: expectedCrypto.id,
				},
			});
			expect(JSON.parse(JSON.stringify(updatedCrypto))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);
		});

		test('PUT crypto authenticated as admin all fields', async () => {
			const expectedCrypto: Crypto = {
				id: 1,
				name: 'Dogecoin',
				api_id: 'DOGE',
				logo_url:
					'https://altcoinsbox.com/wp-content/uploads/2023/01/dogecoin-logo.png',
				visible: true,
			};
			await setRegisteredUserAdmin(database, registeredUserId);
			const res = await request(app)
				.put('/api/cryptos/1')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Dogecoin',
					apiId: 'DOGE',
					logoUrl:
						'https://altcoinsbox.com/wp-content/uploads/2023/01/dogecoin-logo.png',
					visible: true,
				});
			// Assert response
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);

			// Assert database update
			const updatedCrypto = await database.crypto.findUnique({
				where: {
					id: expectedCrypto.id,
				},
			});
			expect(JSON.parse(JSON.stringify(updatedCrypto))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);
		});

		test('PUT crypto with no body', async () => {
			const expectedCrypto = exampleCryptos[1];
			const res = await request(app)
				.put('/api/cryptos/2')
				.set('Authorization', `Bearer ${authToken}`)
				.send();
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);
		});

		test('PUT crypto with empty body', async () => {
			const expectedCrypto = exampleCryptos[1];
			const res = await request(app)
				.put('/api/cryptos/2')
				.set('Authorization', `Bearer ${authToken}`)
				.send({});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.OK_200);
			expect(JSON.parse(JSON.stringify(res.body))).toStrictEqual(
				JSON.parse(JSON.stringify(expectedCrypto))
			);
		});

		test('PUT crypto with invalid logo url', async () => {
			const res = await request(app)
				.put('/api/cryptos/1')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					logoUrl: 'http/upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo',
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		test('PUT crypto with existing name', async () => {
			const res = await request(app)
				.put('/api/cryptos/3')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					name: 'Bitcoin',
					apiId: 'SOL',
					logoUrl: 'http/upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo',
					visible: false,
				});
			expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST_400);
		});

		afterAll(async () => {
			await deleteAllCryptos(database);
			await deleteAllUsers(database);
		});
	});
});
