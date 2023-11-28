import { Crypto } from '@prisma/client';
import { database } from '~lucia';

export async function createCrypto(
	crypto: Omit<Crypto, 'id'>,
): Promise<Crypto> {
	return await database.crypto.create({
		data: crypto,
	});
}

export async function updateCryptoById(
	cryptoId: number,
	updates: Partial<Omit<Crypto, 'id'>>,
): Promise<Crypto> {
	return await database.crypto.update({
		where: {
			id: cryptoId,
		},
		data: updates,
	});
}

export async function deleteCryptoById(cryptoId: number): Promise<Crypto> {
	return await database.crypto.delete({
		where: {
			id: cryptoId,
		},
	});
}

export async function findManyCryptosById(ids: number[]) {
	return await database.crypto.findMany({
		where: { id: { in: ids } },
	});
}

export async function removeCryptoFromUser(userId: string) {
	return await database.userCrypto.deleteMany({
		where: { user_id: userId },
	});
}

export async function addCryptoToUser(userId: string, cryptos: number[]) {
	return await database.userCrypto.createMany({
		data: cryptos.map((crypto) => ({
			user_id: userId,
			crypto_id: crypto,
		})),
	});
}
