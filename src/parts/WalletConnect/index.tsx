
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import ConnectedWalletButtonComponent from './ConnectedWalletButtonComponent';
import ErrorModal from 'components/ErrorModal';
import JadeContainedButton from 'components/JadeContainedButton';
import useEagerConnect from 'utils/hooks/web3/use-eager-connect';
import useInactiveListener from 'utils/hooks/web3/use-inactive-listener';
import { injected } from 'utils/helpers/web3/connectors';
import getBlockchainNetworkErrorMessage from 'utils/helpers/web3/get-blockchain-network-error-message';

const WalletConnect = (): JSX.Element => {
  const {
    account,
    connector,
    activate,
    deactivate,
    active,
    error
  } = useWeb3React<Web3Provider>();

  // Handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [
    activatingConnector,
    connector
  ]);

  // Handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // Handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
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

  // ray test touch <
  return (
    <>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-2',
          'mx-1'
        )}>
        {account && (
          <ConnectedWalletButtonComponent account={account} />
        )}
        {(active || error) ? (
          <JadeContainedButton
            onClick={handleDeactivate}>
            Disconnect Wallet
          </JadeContainedButton>
        ) : (
          <JadeContainedButton
            disabled={connectDisabled || activating}
            onClick={handleActivate}>
            Connect Wallet
          </JadeContainedButton>
        )}
      </div>
      {!!error && (
        <ErrorModal
          open={!!error}
          onClose={handleDeactivate}
          title='Connection Failed'
          description={getBlockchainNetworkErrorMessage(error)} />
      )}
    </>
  );
  // ray test touch >
};

export default WalletConnect;
