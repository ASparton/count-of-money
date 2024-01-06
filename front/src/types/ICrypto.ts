import ECryptoID from "./ECryptoID";

export interface ICryptoLight {
  id?: number;
  name: string;
  api_id: string;
  image: string;
  is_visible: boolean;
}

interface ICrypto {
  name: string;
  id: number;
  trigram: ECryptoID;

  current_price: number;
  opening_price: number;
  lowest_price: number;
  highest_price: number;

  image: string;
  isLiked: boolean;
}

export default ICrypto;
