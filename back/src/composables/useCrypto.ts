import { binance } from 'ccxt';

const _exchange = new binance();

async function getAllCrypto(cryptos: string[]) {
	return await _exchange.fetchTickers(cryptos);
}

async function getCrypto(crypto: string) {
	return await _exchange.fetchTicker(crypto);
}

const useCrypto = () => ({
	getAllCrypto,
	getCrypto,
});

export default useCrypto;
