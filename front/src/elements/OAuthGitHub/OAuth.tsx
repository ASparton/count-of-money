import { Button } from "@mantine/core";
import Fetcher from "../../services/fetcher/fetcher";

const githubOAuthURL = `users/github`;

const GitHubOAuth = () => {
  const handleGithubSignIn = () => {
    Fetcher.get<{ redirectUrl: string }>(githubOAuthURL).then((res) => {
      console.log("res", res.data.redirectUrl);
      window.location.replace(res.data.redirectUrl);
    });
  };

  return (
    <div>
      <Button
        onClick={() => {
          handleGithubSignIn();
        }}
      >
        Sign in with GitHub
      </Button>
    </div>
  );
};

export default GitHubOAuth;
