import { z } from 'zod';

const CreateUpdateCryptoDto = z.object({
	name: z.string().min(3),
	logoUrl: z.string().url(),
	apiId: z.string().length(3).toUpperCase(),
	visible: z.boolean().default(true),
});

export default CreateUpdateCryptoDto;
