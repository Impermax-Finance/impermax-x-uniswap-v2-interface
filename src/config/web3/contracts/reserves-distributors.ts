
import { CHAIN_IDS } from 'config/web3/chains';

const RESERVES_DISTRIBUTOR_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ARBITRUM]: '0xe8d14Bf55bE7c7E71E19C8A96027F5537A208f42'
};

export {
  RESERVES_DISTRIBUTOR_ADDRESSES
};
