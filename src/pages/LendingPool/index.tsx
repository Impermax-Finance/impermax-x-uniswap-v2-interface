
import { useParams } from 'react-router-dom';

import LendingPoolContent from './LendingPoolContent';
import MainContainer from 'parts/MainContainer';
import PairAddressContext from 'contexts/PairAddress';
import { PARAMETERS } from 'utils/constants/links';

const LendingPool = (): JSX.Element => {
  const { [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: uniswapV2PairAddress } = useParams<Record<string, string>>();

  return (
    <MainContainer>
      <PairAddressContext.Provider value={uniswapV2PairAddress}>
        <LendingPoolContent />
      </PairAddressContext.Provider>
    </MainContainer>
  );
};

export default LendingPool;
