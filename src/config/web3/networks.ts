
// ray test touch <
// TODO: should consider bundle optimization
import arbitrumIcon from 'assets/images/networks/arbitrum-network.jpg';
import avalancheIcon from 'assets/images/networks/avalanche-network.jpg';
import bscIcon from 'assets/images/networks/bsc-network.jpg';
import fantomIcon from 'assets/images/networks/fantom-network.jpg';
import goerliIcon from 'assets/images/networks/goerli-network.jpg';
import harmonyIcon from 'assets/images/networks/harmony-network.jpg';
import hecoIcon from 'assets/images/networks/heco-network.jpg';
import kovanIcon from 'assets/images/networks/kovan-network.jpg';
import mainnetIcon from 'assets/images/networks/mainnet-network.jpg';
import maticIcon from 'assets/images/networks/matic-network.jpg';
import okexIcon from 'assets/images/networks/okex-network.jpg';
import polygonIcon from 'assets/images/networks/polygon-network.jpg';
import rinkebyIcon from 'assets/images/networks/rinkeby-network.jpg';
import ropstenIcon from 'assets/images/networks/ropsten-network.jpg';
import xDaiIcon from 'assets/images/networks/xdai-network.jpg';
// ray test touch >

const POLLING_INTERVAL = 12000;

const CHAIN_IDS = Object.freeze({
  ETHEREUM_MAIN_NET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  KOVAN: 42,
  MATIC: 137,
  MATIC_TESTNET: 80001,
  FANTOM: 250,
  FANTOM_TESTNET: 4002,
  XDAI: 100,
  BSC: 56,
  BSC_TESTNET: 97,
  ARBITRUM: 42161,
  ARBITRUM_TESTNET: 79377087078960,
  MOONBEAM_TESTNET: 1287,
  AVALANCHE: 43114,
  AVALANCHE_TESTNET: 43113,
  HECO: 128,
  HECO_TESTNET: 256,
  HARMONY: 1666600000,
  HARMONY_TESTNET: 1666700000,
  OKEX: 66,
  OKEX_TESTNET: 65
});

const NETWORK_ICONS = {
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: mainnetIcon,
  [CHAIN_IDS.ROPSTEN]: ropstenIcon,
  [CHAIN_IDS.RINKEBY]: rinkebyIcon,
  [CHAIN_IDS.GÖRLI]: goerliIcon,
  [CHAIN_IDS.KOVAN]: kovanIcon,
  [CHAIN_IDS.FANTOM]: fantomIcon,
  [CHAIN_IDS.FANTOM_TESTNET]: fantomIcon,
  [CHAIN_IDS.BSC]: bscIcon,
  [CHAIN_IDS.BSC_TESTNET]: bscIcon,
  [CHAIN_IDS.MATIC]: polygonIcon,
  [CHAIN_IDS.MATIC_TESTNET]: maticIcon,
  [CHAIN_IDS.XDAI]: xDaiIcon,
  [CHAIN_IDS.ARBITRUM]: arbitrumIcon,
  [CHAIN_IDS.AVALANCHE]: avalancheIcon,
  [CHAIN_IDS.HECO]: hecoIcon,
  [CHAIN_IDS.HECO_TESTNET]: hecoIcon,
  [CHAIN_IDS.HARMONY]: harmonyIcon,
  [CHAIN_IDS.HARMONY_TESTNET]: harmonyIcon,
  [CHAIN_IDS.OKEX]: okexIcon,
  [CHAIN_IDS.OKEX_TESTNET]: okexIcon
};

interface NetworkDetails {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

const NETWORK_DETAILS: {
  // TODO: should type correctly
  [chainId: number]: NetworkDetails
} = {
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [CHAIN_IDS.FANTOM]: {
    chainId: '0xfa',
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18
    },
    rpcUrls: ['https://rpcapi.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com']
  },
  [CHAIN_IDS.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [CHAIN_IDS.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: [
      // 'https://matic-mainnet.chainstacklabs.com/'
      'https://rpc-mainnet.maticvigil.com'
    ],
    blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com']
  },
  [CHAIN_IDS.HECO]: {
    chainId: '0x80',
    chainName: 'Heco',
    nativeCurrency: {
      name: 'Heco Token',
      symbol: 'HT',
      decimals: 18
    },
    rpcUrls: ['https://http-mainnet.hecochain.com'],
    blockExplorerUrls: ['https://hecoinfo.com']
  },
  [CHAIN_IDS.XDAI]: {
    chainId: '0x64',
    chainName: 'xDai',
    nativeCurrency: {
      name: 'xDai Token',
      symbol: 'xDai',
      decimals: 18
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai']
  },
  [CHAIN_IDS.HARMONY]: {
    chainId: '0x63564C40',
    chainName: 'Harmony One',
    nativeCurrency: {
      name: 'One Token',
      symbol: 'ONE',
      decimals: 18
    },
    rpcUrls: ['https://api.s0.t.hmny.io'],
    blockExplorerUrls: ['https://explorer.harmony.one/']
  },
  [CHAIN_IDS.AVALANCHE]: {
    chainId: '0xA86A',
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche Token',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://explorer.avax.network']
  },
  [CHAIN_IDS.OKEX]: {
    chainId: '0x42',
    chainName: 'OKEx',
    nativeCurrency: {
      name: 'OKEx Token',
      symbol: 'OKT',
      decimals: 18
    },
    rpcUrls: ['https://exchainrpc.okex.org'],
    blockExplorerUrls: ['https://www.oklink.com/okexchain']
  }
};

const NETWORK_LABELS: { [chainId: number]: string } = {
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: 'Ethereum',
  [CHAIN_IDS.RINKEBY]: 'Rinkeby',
  [CHAIN_IDS.ROPSTEN]: 'Ropsten',
  [CHAIN_IDS.GÖRLI]: 'Görli',
  [CHAIN_IDS.KOVAN]: 'Kovan',
  [CHAIN_IDS.FANTOM]: 'Fantom',
  [CHAIN_IDS.FANTOM_TESTNET]: 'Fantom Testnet',
  [CHAIN_IDS.MATIC]: 'Polygon (Matic)',
  [CHAIN_IDS.MATIC_TESTNET]: 'Matic Testnet',
  [CHAIN_IDS.XDAI]: 'xDai',
  [CHAIN_IDS.BSC]: 'BSC',
  [CHAIN_IDS.BSC_TESTNET]: 'BSC Testnet',
  [CHAIN_IDS.AVALANCHE]: 'Avalanche',
  [CHAIN_IDS.HECO]: 'HECO',
  [CHAIN_IDS.HECO_TESTNET]: 'HECO Testnet',
  [CHAIN_IDS.HARMONY]: 'Harmony',
  [CHAIN_IDS.HARMONY_TESTNET]: 'Harmony Testnet',
  [CHAIN_IDS.OKEX]: 'OKExChain',
  [CHAIN_IDS.OKEX_TESTNET]: 'OKExChain'
};

export {
  CHAIN_IDS,
  POLLING_INTERVAL,
  NETWORK_ICONS,
  NETWORK_DETAILS,
  NETWORK_LABELS
};
