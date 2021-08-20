
import { useParams } from 'react-router-dom';

import Borrowables from './Borrowables';
import AccountLendingPool from './AccountLendingPool';
import OracleAlert from './OracleAlert';
import MainContainer from 'parts/MainContainer';
// ray test touch <
import PairAddressContext from 'contexts/PairAddress';
// ray test touch >
import { useOracleIsInitialized } from 'hooks/useData';
import { PARAMETERS } from 'utils/constants/links';

const LendingPool = (): JSX.Element => {
  const { [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress } = useParams<Record<string, string>>();

  // ray test touch <
  const oracleIsInitialized = useOracleIsInitialized(selectedUniswapV2PairAddress);
  // ray test touch >

  return (
    <MainContainer>
      <PairAddressContext.Provider value={selectedUniswapV2PairAddress}>
        {oracleIsInitialized ? (
          <>
            <Borrowables />
            <AccountLendingPool />
          </>
        ) : (
          <OracleAlert />
        )}
      </PairAddressContext.Provider>
    </MainContainer>
  );
};

export default LendingPool;
