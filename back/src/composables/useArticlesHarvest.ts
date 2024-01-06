import FeedArticle from "#types/FeedArticle";
import Parser from "rss-parser";

const xmlParser = new Parser();

const useArticlesHarvest = () => {
  async function parseRSSFeed(feedUrl: string): Promise<FeedArticle[]> {
    const feedResponse = await fetch(feedUrl);
    const rawTextFeed = await feedResponse.text();
    const feed = await xmlParser.parseString(rawTextFeed);
    return feed.items.map((xmlArticle) => parseRSSItem(xmlArticle));
  }

  function parseRSSItem(item: Parser.Item): FeedArticle {
    return {
      title: item.title as string,
      url: item.link as string,
      content: item.content as string,
      image_url: item.enclosure ? item.enclosure.url : null,
      published: new Date(item.pubDate as string),
    };
  }

  return {
    parseRSSFeed,
  };
};

export default useArticlesHarvest;
