
import { CHAIN_IDS } from 'config/web3/networks';

const SIMPLE_UNISWAP_ORACLE_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: '0xc53bb18028feA1B413057e2b2474F9838c465Fc3',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: '0x5671B249391cA5E6a8FE28CEb1e85Dc41c12Ba7D'
};

export {
  SIMPLE_UNISWAP_ORACLE_ADDRESSES
};
