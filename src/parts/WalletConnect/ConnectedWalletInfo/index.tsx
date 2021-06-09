
import * as React from 'react';
import { Link } from 'react-router-dom';

import ButtonGroup, { JadeButtonGroupItem } from 'components/ButtonGroup';
import AccountModal from 'components/InteractionModal/AccountModal';
import shortenAddress from 'utils/helpers/web3/shorten-address';
import {
  useAllTransactions,
  isTransactionRecent
} from 'store/transactions/hooks';
import { TransactionDetails } from 'store/transactions/reducer';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';

interface Props {
  account: string;
}

function ConnectedWalletInfo({ account } : Props): JSX.Element {
  const accountPageURL = PAGES.ACCOUNT.replace(`:${PARAMETERS.ACCOUNT}`, account);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = React.useMemo(() => {
    const transactions = Object.values(allTransactions);

    return transactions.filter(isTransactionRecent).sort(function (a: TransactionDetails, b: TransactionDetails) {
      return b.addedTime - a.addedTime;
    });
  }, [allTransactions]);

  const pendingTransactions = sortedRecentTransactions.filter(transaction => !transaction.receipt);
  const confirmedTransactions = sortedRecentTransactions.filter(transaction => transaction.receipt);

  const [accountModalOpen, setAccountModalOpen] = React.useState(false);

  const handleOpenAccountModal = () => {
    setAccountModalOpen(true);
  };

  return (
    <>
      <ButtonGroup>
        <JadeButtonGroupItem
          pending={pendingTransactions.length > 0}
          onClick={handleOpenAccountModal}>
          Transactions
        </JadeButtonGroupItem>
        <JadeButtonGroupItem>
          <Link to={accountPageURL}>
            {shortenAddress(account)}
          </Link>
        </JadeButtonGroupItem>
      </ButtonGroup>
      <AccountModal
        show={accountModalOpen}
        toggleShow={setAccountModalOpen}
        pending={pendingTransactions}
        confirmed={confirmedTransactions} />
    </>
  );
}

export default ConnectedWalletInfo;
