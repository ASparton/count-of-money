import { Request } from 'express';
import { parseCookie } from 'lucia/utils';
import { githubAuth } from '~lucia';

const useGithubAuth = () => {
	function isOAuthStateValid(req: Request): boolean {
		const cookies = parseCookie(req.headers.cookie ?? '');
		const storedState = cookies.github_oauth_state;
		const state = req.query.state;
		const code = req.query.code;
		// validate state
		if (
			!storedState ||
			!state ||
			storedState !== state ||
			typeof code !== 'string'
		) {
			return false;
		}
		return true;
	}

	async function getOrCreateGithubUser(githubCode: string) {
		const { getExistingUser, githubUser, createUser } =
			await githubAuth.validateCallback(githubCode);

		const existingUser = await getExistingUser();
		if (existingUser) return existingUser;
		const user = await createUser({
			attributes: {
				username: githubUser.login,
				email: githubUser.email as string,
				currency: 'EUR',
				is_admin: false,
			},
		});
		return user;
	}

	return {
		isOAuthStateValid,
		getOrCreateGithubUser,
	};
};

export default useGithubAuth;
