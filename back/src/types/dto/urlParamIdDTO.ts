import { z } from 'zod';

const urlParamIdDTO = z.object({
	id: z.coerce.number(),
});

export default urlParamIdDTO;
