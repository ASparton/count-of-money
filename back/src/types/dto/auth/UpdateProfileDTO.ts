import { z } from 'zod';

const UpdateProfileDto = z.object({
	username: z.string(),
	currency: z.string().length(3).toUpperCase(),
	keywords: z.array(z.string()),
	cryptos: z.array(z.coerce.number()),
});

export default UpdateProfileDto;
