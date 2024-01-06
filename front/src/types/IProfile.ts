import ECryptoID from "./ECryptoID";

export interface _ICrypto {
  user_id: string;
  crypto_id: number;
  crypto: {
    id: number;
    name: ECryptoID;
    logo_url: string;
    api_id: ECryptoID;
    is_visible: false;
  };
}

export interface _IKeywords {
  id: number;
  name: string;
  user_id: string;
}

export interface IProfile {
  username: string;
  email: string;

  id: string;
  is_admin: true;
  currency: ECryptoID;
  cryptos: _ICrypto[];
  keywords: _IKeywords[];
}
