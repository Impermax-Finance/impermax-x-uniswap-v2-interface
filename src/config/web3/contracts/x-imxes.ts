
import { CHAIN_IDS } from 'config/web3/chains';

const X_IMX_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ARBITRUM]: '0x27205620EfB293D50B0e624421620513394eA78f'
};

const X_IMX_DECIMALS = 18;

export {
  X_IMX_ADDRESSES,
  X_IMX_DECIMALS
};
