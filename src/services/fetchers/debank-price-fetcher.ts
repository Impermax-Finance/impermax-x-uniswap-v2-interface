
import getPriceFromDebank from '../get-price-from-debank';

const DEBANK_PRICE_FETCHER = 'debank-price-fetcher';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const debankPriceFetcher = async ({ queryKey }: any): Promise<number> => {
  const [
    _key,
    chainID,
    tokenAddress
  ] = queryKey;

  if (_key !== DEBANK_PRICE_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getPriceFromDebank(chainID, tokenAddress);
};

export {
  DEBANK_PRICE_FETCHER
};

export default debankPriceFetcher;
