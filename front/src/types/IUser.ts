import ECryptoID from "./ECryptoID";

export interface IUser {
	username?: string;
	email?: string;
	isAuth?: boolean;
	password?: string;
	token?: string;
	isAdmin?: boolean;
	currency?: ECryptoID;
}
