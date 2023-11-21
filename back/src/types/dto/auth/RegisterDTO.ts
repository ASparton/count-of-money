import { z } from 'zod';

const RegisterDTO = z.object({
	email: z.string().email(),
	password: z.string(),
	username: z.string(),
	currency: z.string().length(3).optional(),
});

export default RegisterDTO;
