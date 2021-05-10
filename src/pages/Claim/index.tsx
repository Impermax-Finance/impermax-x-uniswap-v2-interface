
import {
  Container,
  Card
} from 'react-bootstrap';

import View from 'components/View';
import { useDistributors } from 'hooks/useNetwork';
import { DistributorDetails } from 'utils/constants';
import ClaimDistributor from 'components/ClaimDistributor';

const Claim = (): JSX.Element => {
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
};

export default Claim;
