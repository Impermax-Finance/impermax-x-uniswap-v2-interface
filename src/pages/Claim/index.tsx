
import {
  Container,
  Card
} from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ClaimDistributor from 'components/ClaimDistributor';
import { DistributorDetails } from 'utils/constants';
import { DISTRIBUTOR_ADDRESSES } from 'config/web3/contracts/distributors';

const Claim = (): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();

  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }
  const distributors = DISTRIBUTOR_ADDRESSES[chainId];

  return (
    <Container>
      <Card className='mt-5'>
        {distributors.map(
          (distributor: DistributorDetails, key: any) => (<ClaimDistributor
            distributor={distributor}
            key={key} />)
        )}
      </Card>
    </Container>
  );
};

export default Claim;
