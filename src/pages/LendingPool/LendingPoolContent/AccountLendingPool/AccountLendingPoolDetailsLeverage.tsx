// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useContext } from 'react';
import { LanguageContext } from 'contexts/LanguageProvider';
import phrases from './translations';
import { Row, Col } from 'react-bootstrap';
import { formatUSD } from '../../../../utils/format';
import DetailsRow from '../../../../components/DetailsRow';
import { useDebtUSD, useDepositedUSD, useLPEquityUSD } from '../../../../hooks/useData';
import RiskMetrics from '../../../../components/RiskMetrics';
import { PoolTokenType } from '../../../../types/interfaces';

/**
 * Generates lending pool aggregate details.
 */

export default function AccountLendingPoolDetailsLeverage(): JSX.Element {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const LPEquityUSD = useLPEquityUSD();
  const collateralUSD = useDepositedUSD(PoolTokenType.Collateral);
  const debtUSD = useDebtUSD();
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
            name={t('Total Collateral')}
            value={formatUSD(collateralUSD)} />
          <DetailsRow
            name={t('Total Debt')}
            value={formatUSD(debtUSD)} />
          <DetailsRow
            name={t('LP Equity')}
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
