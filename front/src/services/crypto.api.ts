import ECryptoID, { getCryptoName } from "../types/ECryptoID";
import ICrypto, { ICryptoLight } from "../types/ICrypto";
import { IProfile } from "../types/IProfile";
import Fetcher from "./fetcher/fetcher";
import Response from "./fetcher/response";
import { getProfile, putProfile } from "./user.api";

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
): Promise<Response<IProfile>> => {
  return getProfile()
    .then((res) => {
      const { username, currency, keywords, cryptos } = res.data;

      let _cryptosIDs = cryptos.map((c) => c.crypto.id);
      const indexID = _cryptosIDs.findIndex((cID) => cID === id);

      if (indexID < 0) {
        _cryptosIDs = [..._cryptosIDs, id];
      } else {
        _cryptosIDs = [
          ..._cryptosIDs.slice(0, indexID),
          ..._cryptosIDs.slice(indexID + 1, _cryptosIDs.length),
        ];
      }
      return { id, username, currency, keywords, _cryptosIDs };
    })
    .then(async ({ username, currency, _cryptosIDs, keywords }) =>
      putProfile(
        username,
        currency,
        _cryptosIDs,
        keywords.map((k) => k.name)
      )
    );
};

export const getLightCryptoList = async (): Promise<
  Response<ICryptoLight[]>
> => {
  return Fetcher.get<ICryptoLight[]>(`${URI}/list`).then((res) => ({
    ...res,
    data: res.data.map((o) => ({
      id: o.id,
      name: getCryptoName(o.name as ECryptoID),
      image: o.image,
      api_id: o.name as ECryptoID,
      is_visible: o.is_visible,
    })),
  }));
};

export const deleteCrypto = (id: number) => {
  return Fetcher.delete(`${URI}/${id}`);
};

export const addCrypto = (crypto: any): Promise<Response<ICryptoLight>> => {
  return Fetcher.post<ICryptoLight>(URI, crypto);
};

export const setVisible = (
  crypto: ICryptoLight
): Promise<Response<ICryptoLight>> => {
  return Fetcher.put<ICryptoLight>(URI + "/" + crypto.id, {
    ...crypto,
    name: crypto.api_id,
    visible: !crypto.is_visible,
  });
};

