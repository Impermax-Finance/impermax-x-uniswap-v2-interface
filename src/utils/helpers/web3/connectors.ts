
import { InjectedConnector } from '@web3-react/injected-connector';

import { CHAIN_IDS } from 'config/web3/networks';

const injected = new InjectedConnector({
  supportedChainIds: Object.values(CHAIN_IDS)
});

export {
  injected
};
