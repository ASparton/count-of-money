import { binance } from 'ccxt';

const _exchange = new binance();

async function getAllCrypto(cryptos: string[]) {
	return await _exchange.fetchTickers(cryptos);
}

const useCrypto = () => ({
	getAllCrypto,
});

export default useCrypto;
