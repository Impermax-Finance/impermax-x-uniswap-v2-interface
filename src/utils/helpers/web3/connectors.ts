
import { InjectedConnector } from '@web3-react/injected-connector';

import { CHAIN_IDS } from 'config/web3/chains';

const injected = new InjectedConnector({
  supportedChainIds: [
    CHAIN_IDS.ETHEREUM_MAIN_NET
  ]
});

export {
  injected
};
