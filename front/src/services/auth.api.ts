import { IAuthResponse, ILoginData, IRegisterData } from "../types/IAuth";
import Fetcher from "./fetcher/fetcher";
import Response from "./fetcher/response";

export const register = async (
  params: IRegisterData
): Promise<Response<IAuthResponse>> => {
  return Fetcher.post<IAuthResponse>("users/register", params, {}, false);
};

export const login = async (
  params: ILoginData
): Promise<Response<IAuthResponse>> => {
  return Fetcher.post<IAuthResponse>("users/login", params, {}, false);
};
