import { database } from '~lucia';
import { Article, Prisma } from '@prisma/client';

export async function findArticles(keywords: string[]): Promise<Article[]> {
	// Build keyword filter query
	const keywordFilters = keywords.map((keyword) => {
		return {
			title: {
				contains: keyword,
				mode: Prisma.QueryMode.insensitive,
			},
		};
	});
	let query = undefined;
	if (keywordFilters.length > 0)
		query = {
			where: {
				OR: keywordFilters,
			},
		};

	return await database.article.findMany(query);
}
