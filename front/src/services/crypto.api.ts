import ECryptoID, { getCryptoName } from "../types/ECryptoID";
import ICrypto from "../types/ICrypto";
import Fetcher from "./fetcher/fetcher";
import Response from "./fetcher/response";

const URI = "cryptos";

export const getCryptoList = async (): Promise<Response<ICrypto[]>> => {
  return Fetcher.get<ICrypto[]>(URI).then((res) => ({
    ...res,
    data: res.data.map((o) => ({
      ...o,
      name: getCryptoName(o.name as ECryptoID),
      trigram: o.name as ECryptoID,
      highest_price: 0,
      isLiked: false,
    })),
  }));
};

export const updateLikeCrypto = async (
  id: number
): Promise<Response<ICrypto[]>> => {
  return Fetcher.post<ICrypto[]>(URI + "/like", { id });
};
