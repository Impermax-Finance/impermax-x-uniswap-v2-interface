
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import PairAddressContext from 'contexts/PairAddress';
import LendingPoolPage from 'components/LendingPoolPage';
import { PARAMETERS } from 'utils/constants/links';

const LendingPool = (): JSX.Element => {
  const { [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: uniswapV2PairAddress } = useParams<Record<string, string>>();

  return (
    <Container>
      <PairAddressContext.Provider value={uniswapV2PairAddress}>
        <LendingPoolPage />
      </PairAddressContext.Provider>
    </Container>
  );
};

export default LendingPool;
