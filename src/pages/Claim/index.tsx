
import {
  Container,
  Card
} from 'react-bootstrap';

import Layout from 'parts/Layout';
import { useDistributors } from 'hooks/useNetwork';
import { DistributorDetails } from 'utils/constants';
import ClaimDistributor from 'components/ClaimDistributor';

const Claim = (): JSX.Element => {
  const distributors = useDistributors();

  return (
    <Layout>
      <Container>
        <Card className='mt-5'>
          {distributors.map(
            (distributor: DistributorDetails, key: any) => (<ClaimDistributor
              distributor={distributor}
              key={key} />)
          )}
        </Card>
      </Container>
    </Layout>
  );
};

export default Claim;
