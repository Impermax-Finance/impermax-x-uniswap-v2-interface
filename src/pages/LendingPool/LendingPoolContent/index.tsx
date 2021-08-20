
import OracleAlert from './OracleAlert';
import Borrowables from './Borrowables';
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
      <Borrowables />
      <AccountLendingPool />
    </>
  );
};

export default LendingPoolContent;
