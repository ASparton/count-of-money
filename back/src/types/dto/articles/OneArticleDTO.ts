import { z } from 'zod';

const OneArticleDTO = z.object({
	id: z.coerce.number(),
});

export default OneArticleDTO;
