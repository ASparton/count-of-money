import { INews } from "../types/INews";
import Fetcher from "./fetcher/fetcher";
import Response from "./fetcher/response";

const URI = "articles";

export const getNews = async (params: string[]): Promise<Response<INews[]>> => {
  return Fetcher.get<INews[]>(URI, params);
};
