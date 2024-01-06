import { z } from "zod";

/**
 * Retun a list of number given a list of ids as a string, separated by ';'
 */
const convertStringToIdList = (ids: string) => {
  return ids
    .split(";")
    .map((id) => parseInt(id))
    .filter((id) => !Number.isNaN(id));
};

const UrlParamIdDTO = z.object({
  ids: z.string().transform(convertStringToIdList).optional(),
});

export default UrlParamIdDTO;
