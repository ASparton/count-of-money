import { IUser } from "./IUser";

export interface IRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    is_admin: boolean;
    userId: string;
  } & IUser;
  token: string;
}
