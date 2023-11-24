import FeedArticle from '#types/FeedArticle';
import { Article, Feed, Prisma } from '@prisma/client';
import { database } from '~lucia';

export async function findArticlesByKeywords(
	keywords: string[],
): Promise<Article[]> {
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

export async function findCountRestrictedArticles(): Promise<Article[]> {
	let articlesFound: Article[] = [];
	const feeds = await database.feed.findMany({ include: { articles: true } });
	for (const feed of feeds)
		articlesFound = articlesFound.concat(await getMinArticlesCountOfFeed(feed));
	return articlesFound;
}

export async function findArticleById(id: number): Promise<Article | null> {
	return await database.article.findUnique({
		where: {
			id: id,
		},
	});
}

export async function createManyArticles(
	feedId: number,
	feedArticles: FeedArticle[],
) {
	return await database.article.createMany({
		data: feedArticles.map((feedArticle) => {
			return {
				source_feed_id: feedId,
				...feedArticle,
			};
		}),
	});
}

async function getMinArticlesCountOfFeed(feed: Feed): Promise<Article[]> {
	return await database.article.findMany({
		where: { source_feed_id: feed.id },
		orderBy: { published: 'asc' },
		take: feed.min_articles_count,
	});
}
