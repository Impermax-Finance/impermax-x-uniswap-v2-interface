
import { DEBANK_IDS } from '../config/web3/debank-ids';

const getPriceFromDebank = async (
  chainID: number,
  tokenAddress: string
): Promise<number> => {
  try {
    const response = await fetch('https://openapi.debank.com/v1/token?chain_id=' + DEBANK_IDS[chainID] + '&id=' + tokenAddress);
    if (response.status !== 200) return 0;
    const data = await response.json();
    if (!data) return 0;
    return data.price ? data.price : 0;
  } catch {
    return 0;
  }
};

export default getPriceFromDebank;
