import { z } from "zod";

const UrlParamIdDTO = z.object({
  id: z.coerce.number(),
});

export default UrlParamIdDTO;
