
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import useEagerConnect from 'utils/hooks/web3/use-eager-connect';
import useInactiveListener from 'utils/hooks/web3/use-inactive-listener';
import { injected } from 'utils/helpers/web3/connectors';
import getBlockchainNetworkErrorMessage from 'utils/helpers/web3/get-blockchain-network-error-message';

const WalletConnect = (): JSX.Element => {
  const {
    connector,
    activate,
    deactivate,
    active,
    error
  } = useWeb3React<Web3Provider>();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [
    activatingConnector,
    connector
  ]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const currentConnector = injected;
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;
  const connectDisabled = !triedEager || !!activatingConnector || connected || !!error;

  const handleActivate = () => {
    setActivatingConnector(currentConnector);
    activate(injected);
  };

  const handleDeactivate = () => {
    deactivate();
  };

  // TODO: should improve the UI/UX
  return (
    <>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-2',
          'mx-1'
        )}>
        <button
          style={{ minWidth: 160 }}
          className={clsx(
            'border',
            'text-white'
          )}
          disabled={connectDisabled || activating}
          onClick={handleActivate}>
          <div className='space-x-1'>
            {connected && <span>✅</span>}
            <span>{connected ? 'Connected' : 'Connect'}</span>
          </div>
        </button>
        {(active || error) && (
          <button
            style={{ minWidth: 160 }}
            className={clsx(
              'border',
              'text-white'
            )}
            onClick={handleDeactivate}>
            Unconnect
          </button>
        )}
      </div>
      {!!error && (
        <h4 className='text-red-500'>{getBlockchainNetworkErrorMessage(error)}</h4>
      )}
    </>
  );
};

export default WalletConnect;
