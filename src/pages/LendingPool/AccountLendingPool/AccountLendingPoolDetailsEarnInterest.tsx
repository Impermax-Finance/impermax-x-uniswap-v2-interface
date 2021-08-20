// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { Row, Col } from 'react-bootstrap';
import { formatUSD, formatPercentage } from '../../../utils/format';
import DetailsRow from '../../../components/DetailsRow';
import { useSuppliedUSD, useAccountAPY } from '../../../hooks/useData';

/**
 * Generates lending pool aggregate details.
 */

export default function AccountLendingPoolDetailsEarnInterest(): JSX.Element {
  const suppliedUSD = useSuppliedUSD();
  const accountAPY = useAccountAPY();

  return (
    <>
      <Row className='account-lending-pool-details'>
        <Col
          sm={12}
          md={6}>
          <DetailsRow
            name='Supply Balance'
            value={formatUSD(suppliedUSD)} />
        </Col>
        <Col
          sm={12}
          md={6}>
          <DetailsRow
            name='Net APY'
            value={formatPercentage(accountAPY)} />
        </Col>
      </Row>
    </>
  );
}
