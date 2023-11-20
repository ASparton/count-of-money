import { z } from "zod";

const RegisterDTO = z.object({
	email: z.string().email(),
	password: z.string(),
	username: z.string(),
});

export default RegisterDTO;
