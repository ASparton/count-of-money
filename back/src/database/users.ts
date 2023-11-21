import { database } from '~lucia';

export async function findUserById(id: string) {
	return await database.user.findUnique({
		where: { id },
		include: {
			cryptos: {
				include: {
					crypto: true,
				},
			},
			keywords: true,
		},
	});
}

interface UpdateUserOptions {
	currency: string;
	username: string;
}

export async function updateUser(
	id: string,
	{ username, currency }: UpdateUserOptions,
) {
	return await database.user.update({
		where: { id },
		data: { currency, username },
		include: {
			cryptos: {
				include: {
					crypto: true,
				},
			},
			keywords: true,
		},
	});
}
