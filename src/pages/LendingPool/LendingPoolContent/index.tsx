
import OracleAlert from './OracleAlert';
import BorrowablesDetails from './BorrowablesDetails';
import AccountLendingPool from './AccountLendingPool';
import { useOracleIsInitialized } from 'hooks/useData';

const LendingPoolContent = (): JSX.Element => {
  const oracleIsInitialized = useOracleIsInitialized();

  if (!oracleIsInitialized) {
    return (
      <OracleAlert />
    );
  }

  return (
    <>
      <BorrowablesDetails />
      <AccountLendingPool />
    </>
  );
};

export default LendingPoolContent;
