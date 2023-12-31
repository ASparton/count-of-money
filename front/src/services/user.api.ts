import ECryptoID, { getCryptoName } from "../types/ECryptoID";
import { IProfile } from "../types/IProfile";
import Fetcher from "./fetcher/fetcher";
import Response from "./fetcher/response";

const URI = "users/";

export const getProfile = async (): Promise<Response<IProfile>> => {
  return Fetcher.get<IProfile>(URI + "profile").then((res: any) => ({
    ...res,
    data: { ...res.data.user } as IProfile,
  }));
};

export const putProfile = async (
  username: string,
  currency: ECryptoID,
  cryptos: number[],
  keywords: string[]
): Promise<Response<IProfile>> => {
  return Fetcher.put<IProfile>(URI + "profile", {
    username,
    currency,
    cryptos,
    keywords,
  });
};

export const getLikedCrypto = async (): Promise<Response<ECryptoID[]>> => {
  return getProfile().then((res) => {
    return {
      ...res,
      data: res.data.cryptos.map((c) => getCryptoName(c.crypto.name)),
    };
  });
};

export const getKeywords = async (): Promise<Response<string[]>> => {
  return getProfile().then((res) => ({
    ...res,
    data: res.data.keywords.map((k) => k.name),
  }));
};

export const setKeywords = async (
  keywords: string[]
): Promise<Response<unknown>> => {
  return getProfile().then((res) =>
    putProfile(
      res.data.username,
      res.data.currency,
      res.data.cryptos.map((c) => c.crypto.id),
      keywords
    )
  );
};
