
import { useParams } from 'react-router-dom';

import LendingPoolContent from './LendingPoolContent';
import MainContainer from 'parts/MainContainer';
import PairAddressContext from 'contexts/PairAddress';
import { PARAMETERS } from 'utils/constants/links';

const LendingPool = (): JSX.Element => {
  const { [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress } = useParams<Record<string, string>>();

  return (
    <MainContainer>
      {/* ray test touch << */}
      <PairAddressContext.Provider value={selectedUniswapV2PairAddress}>
        <LendingPoolContent />
      </PairAddressContext.Provider>
      {/* ray test touch >> */}
    </MainContainer>
  );
};

export default LendingPool;
