declare namespace Lucia {
	type Auth = import("./src/lucia.ts").Auth;
	type DatabaseUserAttributes = {
		email: string,
		username: string
	};
	type DatabaseSessionAttributes = {};
}
