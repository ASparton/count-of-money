import { Feed } from '@prisma/client';
import { database } from '~lucia';

export async function findAllFeeds(): Promise<Feed[]> {
	return await database.feed.findMany();
}

export async function deleteFeedById(feedId: number): Promise<Feed> {
	return await database.feed.delete({
		where: {
			id: feedId,
		},
	});
}
