import HttpStatusCode from "#types/HttpStatusCode";
import UrlParamIdDTO from "#types/dto/UrlParamIdDTO";
import CreateFeedDTO from "#types/dto/feeds/CreateFeedDTO";
import UpdateFeedDto from "#types/dto/feeds/UpdateFeedDTO";
import express from "express";
import {
  createFeed,
  deleteFeedById,
  findAllFeeds,
  updateFeedById,
} from "../database/feeds";

const controller = express.Router();

controller.get("/", async (_, res) => {
  return res.status(HttpStatusCode.OK_200).send(await findAllFeeds());
});

controller.post("/", async (req, res) => {
  const body = CreateFeedDTO.parse(req.body);
  const createdFeed = await createFeed({
    url: body.url,
    min_articles_count: body.minArticlesCount,
  });
  return res.status(HttpStatusCode.CREATED_201).send(createdFeed);
});

controller.put("/:id", async (req, res) => {
  const urlParams = UrlParamIdDTO.parse(req.params);
  const body = UpdateFeedDto.parse(req.body);
  return res
    .status(HttpStatusCode.OK_200)
    .send(await updateFeedById(urlParams.id, body.minArticlesCount));
});

controller.delete("/:id", async (req, res) => {
  const urlParams = UrlParamIdDTO.parse(req.params);
  return res
    .status(HttpStatusCode.OK_200)
    .send(await deleteFeedById(urlParams.id));
});

export default controller;
