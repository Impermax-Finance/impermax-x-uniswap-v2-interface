// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { useContext } from 'react';
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import { Row, Col } from 'react-bootstrap';
import { formatUSD, formatPercentage } from '../../utils/format';
import DetailsRow from '../DetailsRow';
import { useSuppliedUSD, useAccountAPY } from '../../hooks/useData';

/**
 * Generates lending pool aggregate details.
 */

export default function AccountLendingPoolDetailsEarnInterest(): JSX.Element {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const suppliedUSD = useSuppliedUSD();
  const accountAPY = useAccountAPY();

  return (
    <>
      <Row className='account-lending-pool-details'>
        <Col
          sm={12}
          md={6}>
          <DetailsRow
            name={t('Supply Balance')}
            value={formatUSD(suppliedUSD)} />
        </Col>
        <Col
          sm={12}
          md={6}>
          <DetailsRow
            name={t('Net APY')}
            value={formatPercentage(accountAPY)} />
        </Col>
      </Row>
    </>
  );
}
