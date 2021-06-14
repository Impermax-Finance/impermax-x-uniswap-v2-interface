
import { CHAIN_IDS } from 'config/web3/networks';

const MERKLE_DISTRIBUTOR_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: '0x3039c26f9126833baca8edbf61c761cd909f461f',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: '0x2011b5d4d5287cc9d3462b4e8af0e4daf29e3c1d'
};

export {
  MERKLE_DISTRIBUTOR_ADDRESSES
};