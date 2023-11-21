import { database } from '~lucia';

export async function removeKeywordsFromUser(userId: string) {
	return await database.keyword.deleteMany({
		where: { user_id: userId },
	});
}

/**
 */
export async function addKeywordsToUser(userId: string, keywords: string[]) {
	return await database.keyword.createMany({
		data: keywords.map((keyword) => ({
			user_id: userId,
			name: keyword,
		})),
	});
}
