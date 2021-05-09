import View from '../components/View';

import { Container, Card } from 'react-bootstrap';
import { useDistributors } from '../hooks/useNetwork';
import { DistributorDetails } from '../utils/constants';
import ClaimDistributor from '../components/ClaimDistributor';

/**
 * LendingPool page view.
 */

export default function Claim() {
  const distributors = useDistributors();

  return (
    <View>
      <Container>
        <Card className='mt-5'>
          {distributors.map(
            (distributor: DistributorDetails, key: any) => (<ClaimDistributor
              distributor={distributor}
              key={key} />)
          )}
        </Card>
      </Container>
    </View>
  );
}
