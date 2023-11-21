import { Feed } from '@prisma/client';
import { database } from '~lucia';

export async function findAllFeeds(): Promise<Feed[]> {
	return await database.feed.findMany();
}
