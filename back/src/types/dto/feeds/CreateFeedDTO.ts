import { z } from 'zod';

const UpdateFeedDto = z.object({
	url: z.string().url(),
	minArticlesCount: z.coerce.number().gt(0).default(3),
});

export default UpdateFeedDto;
