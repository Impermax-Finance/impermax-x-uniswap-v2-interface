// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { Row, Col } from 'react-bootstrap';
import { formatUSD } from 'utils/format';
import DetailsRow from 'components/DetailsRow';
import { useDebtUSD, useDepositedUSD, useLPEquityUSD } from 'hooks/useData';
import RiskMetrics from 'components/RiskMetrics';
import { PoolTokenType } from 'types/interfaces';

/**
 * Generates lending pool aggregate details.
 */

export default function AccountLendingPoolDetailsLeverage(): JSX.Element {
  const collateralUSD = useDepositedUSD(PoolTokenType.Collateral);
  const debtUSD = useDebtUSD();
  const LPEquityUSD = useLPEquityUSD();
  // TODO: <
  // const currentLeverage = useCurrentLeverage();
  // TODO: >

  const LPEquityExplanation = 'Calculated as: Total Collateral - Total Debt';

  return (
    <>
      <Row className='account-lending-pool-details'>
        <Col
          sm={12}
          md={6}>
          <DetailsRow
            name='Total Collateral'
            value={formatUSD(collateralUSD)} />
          <DetailsRow
            name='Total Debt'
            value={formatUSD(debtUSD)} />
          <DetailsRow
            name='LP Equity'
            value={formatUSD(LPEquityUSD)}
            explanation={LPEquityExplanation} />
        </Col>
        <Col
          sm={12}
          md={6}>
          <RiskMetrics />
        </Col>
      </Row>
    </>
  );
}
