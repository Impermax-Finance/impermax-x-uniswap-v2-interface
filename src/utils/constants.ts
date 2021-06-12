import { Networks } from './connections';

export type NetworkIndex = {
  [key in Networks]: any
};

export type Address = string;

export type DistributorDetails = {
  claimableAddress: Address,
  name: string,
}

// TODO: should keep as environment variables
export const RPC_URLS = {
  1: 'wss://mainnet.infura.io/ws/v3/2644163ee7bc4f2eb8dae1f58642d158',
  3: 'wss://ropsten.infura.io/ws/v3/2644163ee7bc4f2eb8dae1f58642d158'
};

export const CLAIM_AGGREGATOR: NetworkIndex = {
  [Networks.Ropsten]: '0x2078270ae9956f1298f8bfd8be43306bbd4ab551',
  [Networks.Mainnet]: '0x5287cac629be59997602b4177cb4420165264b69'
};

export const MERKLE_DISTRIBUTOR: NetworkIndex = {
  [Networks.Ropsten]: '0x3039c26f9126833baca8edbf61c761cd909f461f',
  [Networks.Mainnet]: '0x2011b5d4d5287cc9d3462b4e8af0e4daf29e3c1d'
};

export const AIRDROP_URL: NetworkIndex = {
  [Networks.Ropsten]: 'https://wispy-truth-7af9.impermax.workers.dev',
  [Networks.Mainnet]: 'https://old-feather-0b99.impermax.workers.dev'
};

export const DISTRIBUTORS: NetworkIndex = {
  [Networks.Ropsten]: [
    { claimableAddress: '0x9192b53fe173025733beb33467d730a4e6bb7f36', name: 'Private Sale' },
    { claimableAddress: '0xb9f3413e206f1d658d4dafb233873dde56cf94fc', name: 'Advisor Allocation' },
    { claimableAddress: '0x175608ea84b38d7df7a4358cf679eccb49b8203c', name: 'Protocol Growth And Development' },
    { claimableAddress: '0x8ab3567aba5151a3ab4c1aff2fc9192178ded78d', name: 'Core Contributor' }
  ],
  [Networks.Mainnet]: [
    { claimableAddress: '0x434547433e383c505e76f22f4174d7ba68b7686c', name: 'Private Sale' },
    { claimableAddress: '0x0f528f19521fde0140668b9eb14025054bfec29e', name: 'Advisor Allocation' },
    { claimableAddress: '0x34c8f7a53e10c17fddf7ee5048c097569d99de59', name: 'Protocol Growth And Development' },
    { claimableAddress: '0x87da8bab9fbd09593f2368dc2f6fac3f80c2a845', name: 'Core Contributor' }
  ]
};
/* export const ROPSTEN_ETH_IMX: Address = '0x0Efc0766F46E1AD825CE18F54F0793dd6814a947';
export const ROPSTEN_ETH_DAI: Address = '0x1c5DEe94a34D795f9EEeF830B68B80e44868d316';
export const ROPSTEN_ETH_UNI: Address = '0x4E99615101cCBB83A462dC4DE2bc1362EF1365e5';
export const ROPSTEN_ETH_USDC: Address = '0x681A4164703351d6AceBA9D7038b573b444d3353';
export const MAINNET_ETH_WBTC: Address = '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940';
export const MAINNET_ETH_USDC: Address = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc';
export const MAINNET_USDT_USDC: Address = '0x3041CbD36888bECc7bbCBc0045E3B1f144466f5f';
export const MAINNET_DUCK_ETH: Address = '0xc5Ed7350E0FB3f780c756bA7d5d8539dc242a414';
export const LISTED_PAIRS: NetworkIndex = {
  [Networks.Ropsten]: [
    ROPSTEN_ETH_IMX,
    ROPSTEN_ETH_DAI,
    ROPSTEN_ETH_UNI,
    //ROPSTEN_ETH_USDC,
  ],
  [Networks.Mainnet]: [
    MAINNET_ETH_WBTC,
    MAINNET_ETH_USDC,
    MAINNET_USDT_USDC,
    MAINNET_DUCK_ETH,
  ]
};*/
