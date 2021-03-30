import React from 'react';
import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountLendingPool from '../components/AccountLendingPool';
import BorrowablesDetails from '../components/BorrowablesDetails';
import { Container, Card } from 'react-bootstrap';
import PairAddressContext from '../contexts/PairAddress';
import { useDoUpdate } from '../hooks/useImpermaxRouter';
import useInterval from 'use-interval';
import { useDistributors } from '../hooks/useNetwork';
import { DistributorDetails } from '../utils/constants';
import ClaimDistributor from '../components/ClaimDistributor';

/**
 * LendingPool page view.
 */
export default function Claim() {
  const distributors = useDistributors();

  return (<View>
    <Container>
      <Card className="mt-5">
        { distributors.map(
          (distributor: DistributorDetails, key: any) => (<ClaimDistributor distributor={distributor} key={key}/>)
        )}
      </Card>
    </Container>
  </View>);
}