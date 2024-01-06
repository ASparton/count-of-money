import { z } from "zod";

const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default LoginDTO;
