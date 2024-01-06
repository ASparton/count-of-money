import { Article } from "@prisma/client";

type FeedArticle = Omit<Article, "id" | "source_feed_id">;

export default FeedArticle;
