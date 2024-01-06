import { z } from "zod";

const CreateCryptoDto = z.object({
  name: z.string().min(3),
  logoUrl: z.string().url(),
  apiId: z.string().min(2).toUpperCase(),
  visible: z.boolean().default(true),
});

export default CreateCryptoDto;
