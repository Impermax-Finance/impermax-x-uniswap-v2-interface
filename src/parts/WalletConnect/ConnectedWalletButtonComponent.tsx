import { useState, useMemo } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import AccountModal from '../../components/InteractionModal/AccountModal';
import { useAllTransactions, isTransactionRecent } from 'store/transactions/hooks';
import { TransactionDetails } from 'store/transactions/reducer';
import { Link } from 'react-router-dom';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

function shortenAddress(address: string) {
  return address.substring(0, 6) + '...' + address.slice(-4);
}

interface Props {
  account: string;
}

/**
 * Sets up a component for the application's wallet section, when the wallet is connected.
 */

// ray test touch <
function ConnectedWalletButtonComponent({ account } : Props): JSX.Element {
  const accountPageURL = PAGES.account.to.replace(`:${PARAMETERS.ACCOUNT}`, account);

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
          onClick={() => toggleAccountModal(true)}>
          Transactions
          {pending.length > 0 && (<Spinner
            animation='border'
            size='sm' />)}
        </Button>
        <Link to={accountPageURL}>
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

export default ConnectedWalletButtonComponent;
// ray test touch >
