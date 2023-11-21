declare namespace Lucia {
	type Auth = import("./src/lucia.ts").Auth;
	type DatabaseUserAttributes = {
		email: string,
		username: string
		currency: string
		is_admin: boolean
	};
	type DatabaseSessionAttributes = {};
}

declare namespace Express {
	export interface Request {
		lucia: {
			sessionId: string
			user: import("lucia").User
		}
	}
}
