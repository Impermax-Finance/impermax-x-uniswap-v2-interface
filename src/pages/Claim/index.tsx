
import {
  Container,
  Card
} from 'react-bootstrap';
// ray test touch <<
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
// ray test touch >>

import ClaimDistributor from 'components/ClaimDistributor';
// ray test touch <<
// import { useDistributors } from 'hooks/useNetwork';
// ray test touch >>
import { DistributorDetails } from 'utils/constants';
// ray test touch <<
import { DISTRIBUTOR_ADDRESSES } from 'config/web3/contracts/distributors';
// ray test touch >>

const Claim = (): JSX.Element => {
  // ray test touch <<
  // const distributors = useDistributors();
  const { chainId } = useWeb3React<Web3Provider>();

  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }
  const distributors = DISTRIBUTOR_ADDRESSES[chainId];
  // ray test touch >>

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
