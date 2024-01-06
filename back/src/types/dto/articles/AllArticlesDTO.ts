import { z } from "zod";

const AllArticlesDTO = z.object({
  keywords: z.string(),
});

export default AllArticlesDTO;
