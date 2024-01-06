import HttpStatusCode from "#types/HttpStatusCode";

import UrlParamIdDTO from "#types/dto/UrlParamIdDTO";
import UrlQueryIdListDTO from "#types/dto/UrlQueryIdListDTO";

import useCrypto from "@composables/useCrypto";
import express from "express";

import CreateCryptoDto from "#types/dto/cryptos/CreateCryptoDTO";
import UpdateCryptoDto from "#types/dto/cryptos/UpdateCryptoDTO";

import {
  createCrypto,
  deleteCryptoById,
  findAllCryptos,
  findAllVisibleCryptos,
  findCryptoById,
  findManyCryptosById,
  updateCryptoById,
} from "@database/cryptos";

import HistoryParamDTO from "#types/dto/cryptos/HistoryParamDTO";
import { adminRoleRequired, authenticationRequired } from "~middlewares";

const { getAllCrypto, getCrypto, getHistory } = useCrypto();
const controller = express.Router();

controller.get("/", async (req, res) => {
  const query = UrlQueryIdListDTO.parse(req.query);
  const currency = req.lucia ? req.lucia.user.currency : "EUR";

  const cryptos = query.ids
    ? await findManyCryptosById(query.ids)
    : await findAllVisibleCryptos();

  const tickers: string[] = [];

  const cryptoWithTicker = cryptos.map((crypto) => {
    const ticker = `${crypto.api_id}/${currency}`;

    tickers.push(ticker);
    return { ticker, ...crypto };
  });

  if (tickers.length === 0) {
    return res.status(HttpStatusCode.OK_200).json([]);
  }

  const apiResponse = await getAllCrypto(tickers);

  const response = cryptoWithTicker.map((crypto) => {
    const data = apiResponse[crypto.ticker];

    if (!data) {
      return;
    }

    return {
      id: crypto.id,
      name: crypto.name,
      current_price: data.last,
      opening_price: data.open,
      lowest_price: data.low,
      highest_price: parseFloat(data.info.highPrice),
      image: crypto.logo_url,
      is_visible: crypto.visible,
    };
  });

  return res.status(HttpStatusCode.OK_200).send(response);
});
controller.get("/list", async (req, res) => {
  const query = UrlQueryIdListDTO.parse(req.query);
  const currency = req.lucia ? req.lucia.user.currency : "EUR";

  const cryptos = query.ids
    ? await findManyCryptosById(query.ids)
    : await findAllCryptos();

  const tickers: string[] = [];

  const cryptoWithTicker = cryptos.map((crypto) => {
    const ticker = `${crypto.api_id}/${currency}`;

    tickers.push(ticker);
    return { ticker, ...crypto };
  });

  if (tickers.length === 0) {
    return res.status(HttpStatusCode.OK_200).json([]);
  }

  const apiResponse = await getAllCrypto(tickers);

  const response = cryptoWithTicker.map((crypto) => {
    const data = apiResponse[crypto.ticker];

    if (!data) {
      return;
    }

    return {
      id: crypto.id,
      name: crypto.name,
      image: crypto.logo_url,
      is_visible: crypto.visible,
    };
  });

  return res.status(HttpStatusCode.OK_200).send(response);
});

controller.get("/:id", authenticationRequired, async (req, res) => {
  const params = UrlParamIdDTO.parse(req.params);
  const currency = req.lucia ? req.lucia.user.currency : "EUR";

  const crypto = await findCryptoById(params.id);
  const apiResponse = await getCrypto(`${crypto.api_id}/${currency}`);

  return res.status(HttpStatusCode.OK_200).send({
    name: crypto.name,
    current_price: apiResponse.last,
    opening_price: apiResponse.open,
    lowest_price: apiResponse.low,
    highest_price: apiResponse.high,
    image: crypto.logo_url,
  });
});

controller.get(
  "/:id/history/:period",
  authenticationRequired,
  async (req, res) => {
    const params = HistoryParamDTO.parse(req.params);
    const currency = req.lucia ? req.lucia.user.currency : "EUR";

    const crypto = await findCryptoById(params.id);
    const apiResponse = await getHistory(
      `${crypto.api_id}/${currency}`,
      params.period
    );

    console.log(apiResponse.length);

    return res.status(HttpStatusCode.OK_200).send(apiResponse);
  }
);

controller.post(
  "/",
  authenticationRequired,
  adminRoleRequired,
  async (req, res) => {
    const body = CreateCryptoDto.parse(req.body);
    const createdCrypto = await createCrypto({
      name: body.name,
      api_id: body.apiId,
      logo_url: body.logoUrl,
      visible: body.visible,
    });
    return res.status(HttpStatusCode.CREATED_201).send(createdCrypto);
  }
);

controller.put(
  "/:id",
  authenticationRequired,
  adminRoleRequired,
  async (req, res) => {
    const urlParams = UrlParamIdDTO.parse(req.params);

    const body = UpdateCryptoDto.parse(req.body);
    const createdCrypto = await updateCryptoById(urlParams.id, {
      name: body.name,
      api_id: body.apiId,
      logo_url: body.logoUrl,
      visible: body.visible,
    });
    return res.status(HttpStatusCode.OK_200).send(createdCrypto);
  }
);

controller.delete(
  "/:id",
  authenticationRequired,
  adminRoleRequired,
  async (req, res) => {
    const urlParams = UrlParamIdDTO.parse(req.params);
    return res
      .status(HttpStatusCode.OK_200)
      .send(await deleteCryptoById(urlParams.id));
  }
);

export default controller;
