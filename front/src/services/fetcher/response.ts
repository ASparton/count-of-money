import { HttpStatusCode } from "axios";

export default interface Response<T> {
  ok: boolean;
  code: HttpStatusCode;
  message?: string;
  data: T;
}
