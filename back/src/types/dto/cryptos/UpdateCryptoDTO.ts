import { z } from 'zod';

const UpdateCryptoDto = z.object({
	name: z.string().min(3).optional(),
	logoUrl: z.string().url().optional(),
	apiId: z.string().min(2).toUpperCase().optional(),
	visible: z.boolean().default(true).optional(),
});

export default UpdateCryptoDto;
