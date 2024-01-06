import { z } from "zod";

const UpdateFeedDto = z.object({
  minArticlesCount: z.coerce.number().gt(0),
});

export default UpdateFeedDto;
