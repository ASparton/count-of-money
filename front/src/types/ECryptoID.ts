enum ECryptoID {
  BITCOIN = "BTC",
  ETHEREUM = "ETH",
  RIPPLE = "XRP",
  LITECOIN = "LTC",
  BITCOIN_CASH = "BCH",
  CARDANO = "ADA",
  POLKADOT = "DOT",
  STELLAR = "XLM",
  CHAINLINK = "LINK",
  BINANCE_COIN = "BNB",
  MONERO = "XMR",
  TRON = "TRX",
  EOS = "EOS",
  TEZOS = "XTZ",
  VECHAIN = "VET",
  THETA_TOKEN = "THETA",
  DASH = "DASH",
  UNISWAP = "UNI",
  COSMOS = "ATOM",
  NEO = "NEO",
}

export default ECryptoID;

export const getCryptoName = (crypto: ECryptoID) => {
  const valueIndex = Object.values(ECryptoID).indexOf(crypto);

  return Object.keys(ECryptoID)[Math.max(valueIndex, 0)];
};
