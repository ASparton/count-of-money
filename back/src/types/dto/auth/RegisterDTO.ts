import { z } from "zod";

const RegisterDTO = z.object({
	email: z.string().email(),
	password: z.string(),
});

export default RegisterDTO;
