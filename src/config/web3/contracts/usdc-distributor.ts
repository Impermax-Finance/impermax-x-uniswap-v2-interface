
import { CHAIN_IDS } from 'config/web3/chains';

const STAKING_REWARD_ADDRESSES: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: '0x18011c2a97fad6c3652570846ee39525f55a2aec'
};

const USDC_CLAIMABLE_DECIMALS = 18;

export {
  STAKING_REWARD_ADDRESSES,
  USDC_CLAIMABLE_DECIMALS
};

