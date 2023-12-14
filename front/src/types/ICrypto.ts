import ECryptoID from "./ECryptoID";

interface ICrypto {
  name: string;
  id: number;
  trigram: ECryptoID;

  current_price: number;
  opening_price: number;
  lowest_price: number;
  highest_price: number;

  logo_url: string;
  isLiked: boolean;
}

export default ICrypto;
