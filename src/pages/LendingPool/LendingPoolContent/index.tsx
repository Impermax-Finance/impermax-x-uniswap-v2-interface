import { useOracleIsInitialized } from '../../../hooks/useData';
import BorrowablesDetails from '../../../components/BorrowablesDetails';
import AccountLendingPool from '../../../components/AccountLendingPool';
import './index.scss';

export default function LendingPoolContent(): JSX.Element {
  const oracleIsInitialized = useOracleIsInitialized();

  if (!oracleIsInitialized) {
    return (
      <div className='oracle-not-initialized'>
        <b>Info</b>: This lending pool has just been created and the TWAP price oracle is not ready yet. Every time a new pair is created on Impermax it cannot be used for 30 minutes in order to gather enough price history.
      </div>
    );
  }

  return (
    <>
      <BorrowablesDetails />
      <AccountLendingPool />
    </>
  );
}
