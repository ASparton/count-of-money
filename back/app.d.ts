declare namespace Lucia {
	type Auth = import("./src/lucia.ts").Auth;
	type DatabaseUserAttributes = {
		email: string,
		username: string
	};
	type DatabaseSessionAttributes = {};
}

declare namespace Express {
	export interface Request {
		lucia: {
			userId: string
			sessionId: string
		}
	}
}
