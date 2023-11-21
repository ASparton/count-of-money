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
