import { Button, ThemeIcon } from "@mantine/core";
import { IconBrandGithubFilled } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { github } from "../../services/auth.api";
import Fetcher from "../../services/fetcher/fetcher";
import { useUserStore } from "../../stores/User.store";

const envVars = import.meta.env;

const githubOAuthURL = `users/github`;

const githubOAuth = axios.create({
  baseURL: "https://github.com/login/oauth/",
});

const GitHubOAuth = () => {
  const navigator = useNavigate();
  const userStore = useUserStore();

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const code = new URLSearchParams(location.search).get("code");
      const state = new URLSearchParams(location.search).get("state");

      navigator(window.location.pathname);

      try {
        github(code ?? "", state ?? "").then((res) => {
          userStore.create({
            ...res.data.user,
            isAdmin: res.data.user.is_admin,
            token: res.data.token,
          });
          navigator("/auth/home");
        });
      } catch (error) {
        console.error("Erreur lors de l'authentification avec GitHub", error);
      }
    };

    if (location.search.includes("code")) {
      handleGitHubCallback();
    }
  }, [location.search, history]);

  const handleGitHubLogin = () => {
    Fetcher.get<{ redirectUrl: string }>(githubOAuthURL).then((res) => {
      console.log("res", res.data.redirectUrl);
      window.location.href = res.data.redirectUrl;
    });
  };

  return (
    <div>
      <Button
        color="black"
        radius={"xl"}
        leftSection={
          <ThemeIcon variant="transparent" color="white">
            <IconBrandGithubFilled />
          </ThemeIcon>
        }
        onClick={handleGitHubLogin}
      >
        Sign in with GitHub
      </Button>
    </div>
  );
};

export default GitHubOAuth;
