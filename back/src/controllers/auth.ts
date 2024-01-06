import express from "express";

import { auth, githubAuth } from "~lucia";

import HttpStatusCode from "#types/HttpStatusCode";
import useGithubAuth from "@composables/useGithubAuth";
import LoginDTO from "@dto/auth/LoginDTO";
import RegisterDTO from "@dto/auth/RegisterDTO";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { parseCookie } from "lucia/utils";

const { isOAuthStateValid, getOrCreateGithubUser } = useGithubAuth();

const controller = express.Router();

controller.post("/login", async (req, res) => {
  const body = LoginDTO.safeParse(req.body);

  if (!body.success) {
    return res.send(body.error.issues);
  }

  const key = await auth.useKey("email", body.data.email, body.data.password);

  const session = await auth.createSession({
    userId: key.userId,
    attributes: {},
  });

  return res.status(HttpStatusCode.OK_200).send({
    user: {
      id: key.userId,
      email: body.data.email,
      is_admin: session.user.is_admin,
    },
    token: session.sessionId,
  });
});

controller.post("/register", async (req, res) => {
  const body = RegisterDTO.parse(req.body);

  const user = await auth.createUser({
    key: {
      providerId: "email",
      providerUserId: body.email,
      password: body.password,
    },
    attributes: {
      email: body.email,
      username: body.username,
      currency: body.currency as string,
      is_admin: false,
    },
  });

  const session = await auth.createSession({
    userId: user.userId,
    attributes: {},
  });

  return res.status(HttpStatusCode.OK_200).send({
    user: {
      id: user.userId,
      email: user.email,
      username: user.username,
      currency: user.currency,
      is_admin: user.is_admin,
    },
    token: session.sessionId,
  });
});

controller.get("/github", async (_, res) => {
  const [url, state] = await githubAuth.getAuthorizationUrl();
  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.json({ redirectUrl: url.toString() });
});

controller.get("/github/callback", async (req, res) => {
  const cookies = parseCookie(req.headers.cookie ?? "");
  const state = req.query.state;
  const code = req.query.code;

  if (!state || typeof code !== "string") {
    return res.sendStatus(400);
  }
  try {
    const { getExistingUser, githubUser, createUser } =
      await githubAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;

      const user = await createUser({
        attributes: {
          username: githubUser.login,
          email: githubUser.email ?? "",
          is_admin: false,
          currency: "EUR",
        },
      });
      return user;
    };

    const user = await getUser();
    auth.createSession({
      userId: user.userId,
      attributes: {},
    });
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return res.sendStatus(400);
    }
    return res.sendStatus(500);
  }
});

export default controller;
