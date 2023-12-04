import HttpStatusCode from '#types/HttpStatusCode';
import ApiErrors, { APIError } from '~apiErrors';

import { binance } from 'ccxt';
const _exchange = new binance();

/**
 * Return the period and limit associated with a given period
 *
 * @param period - either 'daily', 'hourly' or 'minute'
 *
 * @returns a tuple of string and number
 */
function _getPeriodAndLimit(period: string): [string, number] {
	switch (period) {
		case 'daily':
			return ['1d', 60];

		case 'hourly':
			return ['1h', 48];

		case 'minute':
			return ['1m', 120];

		default:
			throw new APIError(ApiErrors.BAD_REQUEST, HttpStatusCode.BAD_REQUEST_400);
	}
}

/**
 * Returns the tickers associated with the given symbols.
 *
 * @param symbols - symbols to fetch
 *
 * @returns a Promise of Ticker array
 */
async function getAllCrypto(symbols: string[]) {
	return await _exchange.fetchTickers(symbols);
}

/**
 * Returns the ticker associated with the given symbol.
 *
 * @param symbol - symbol to fetch
 *
 * @returns a Promise of Ticker
 */
async function getCrypto(symbol: string) {
	return await _exchange.fetchTicker(symbol);
}

/**
 * Retrieves the history of the symbol using the given period.
 *
 * @param symbol - symbol to fetch
 * @param period - period to use
 *
 * @returns a Promise of an OHLCV array
 */
async function getHistory(symbol: string, period: string) {
	const [_period, limit] = _getPeriodAndLimit(period);
	return await _exchange.fetchOHLCV(symbol, _period, undefined, limit);
}

const useCrypto = () => ({
	getAllCrypto,
	getCrypto,
	getHistory,
});

export default useCrypto;
