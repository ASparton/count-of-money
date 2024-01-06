import { Feed } from "@prisma/client";
import { database } from "~lucia";

export async function findAllFeeds(): Promise<Feed[]> {
  return await database.feed.findMany();
}

export async function findFeedById(feedId: number): Promise<Feed> {
  return await database.feed.findUniqueOrThrow({
    where: {
      id: feedId,
    },
  });
}

export async function createFeed(feed: Omit<Feed, "id">): Promise<Feed> {
  return await database.feed.create({
    data: feed,
  });
}

export async function updateFeedById(
  feedId: number,
  newMinArticlesCount: number
): Promise<Feed> {
  return await database.feed.update({
    where: {
      id: feedId,
    },
    data: {
      min_articles_count: newMinArticlesCount,
    },
  });
}

export async function deleteFeedById(feedId: number): Promise<Feed> {
  return await database.feed.delete({
    where: {
      id: feedId,
    },
  });
}
