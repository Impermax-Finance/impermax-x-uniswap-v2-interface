
import { CHAIN_IDS } from 'config/web3/chains';

const X_IMX_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: '0xD6986435Df54C5CBC3F657636ac9D3Bd35368E58',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: ''
};

const X_IMX_DECIMALS = 18;

export {
  X_IMX_ADDRESSES,
  X_IMX_DECIMALS
};
