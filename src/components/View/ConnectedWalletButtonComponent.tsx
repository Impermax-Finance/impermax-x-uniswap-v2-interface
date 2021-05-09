import { useState, useMemo } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import AccountModal from '../InteractionModal/AccountModal';
import { useAllTransactions, isTransactionRecent } from '../../state/transactions/hooks';
import { TransactionDetails } from '../../state/transactions/reducer';
import { useThisAccountUrl } from '../../hooks/useUrlGenerator';
import { Link } from 'react-router-dom';

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

function shortenAddress(address: string) {
  return address.substring(0, 6) + '...' + address.slice(-4);
}

interface ConnectedWalletButtonComponentProps {
  account: string;
}

/**
 * Sets up a component for the application's wallet section, when the wallet is connected.
 */

export function ConnectedWalletButtonComponent({ account } : ConnectedWalletButtonComponentProps): JSX.Element {
  const accountUrl = useThisAccountUrl();

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt);
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt);

  const [showAccountModal, toggleAccountModal] = useState(false);

  return (
    <>
      <div className='connected-wallet'>
        <Button
          className='wallet-connector nav-button-light'
          onClick={() => toggleAccountModal(true)}>Transactions
          {pending.length > 0 && (<Spinner
            animation='border'
            size='sm' />)}
        </Button>
        <Link to={accountUrl}>
          <Button className='wallet-connector nav-button-green'>{shortenAddress(account)}</Button>
        </Link>
      </div>
      <AccountModal
        show={showAccountModal}
        toggleShow={toggleAccountModal}
        pending={pending}
        confirmed={confirmed} />
    </>
  );
}
