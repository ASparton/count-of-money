import Fetcher from "./fetcher/fetcher";
import Response from "./fetcher/response";

const URI = "feeds";

export const getFeeds = async (): Promise<Response<IFeed[]>> => {
  return await Fetcher.get<IFeed[]>(URI).then((res) => res);
};

export const addFeed = async (feed: IFeed): Promise<Response<IFeed>> => {
  return await Fetcher.post<IFeed>(URI, feed);
};

export const deleteFeed = async (id: number): Promise<Response<IFeed>> => {
  return Fetcher.delete<IFeed>(`${URI}/${id}`);
};

const updateFeedLatestToExpose = async (
  feed: IFeed,
  minArticlesCount: number
): Promise<Response<any>> => {
  return Fetcher.put(`${URI}/${feed.id}`, {
    url: feed.url,
    minArticlesCount,
  });
};

export const updateLatestToExpose = async (
  amount: number
): Promise<Response<any>> => {
  return getFeeds().then((res) => {
    const requests: Promise<Response<any>>[] = [];
    res.data.forEach((feed) => {
      requests.push(updateFeedLatestToExpose(feed, amount));
    });
    return Promise.all(requests) as unknown as Response<any>;
  });
};
