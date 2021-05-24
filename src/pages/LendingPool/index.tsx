
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Layout from 'parts/Layout';
import PairAddressContext from 'contexts/PairAddress';
import LendingPoolPage from 'components/LendingPoolPage';

const LendingPool = (): JSX.Element => {
  const { uniswapV2PairAddress } = useParams<{ uniswapV2PairAddress: string }>();

  // const doUpdate = useDoUpdate();
  // useInterval(() => doUpdate(), 60000);

  return (
    <Layout>
      <Container className='lending-pool'>
        <PairAddressContext.Provider value={uniswapV2PairAddress}>
          <LendingPoolPage />
        </PairAddressContext.Provider>
      </Container>
    </Layout>
  );
};

export default LendingPool;
