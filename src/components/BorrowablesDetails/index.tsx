import React from 'react';
import './index.scss';
import { Row, Col, Card } from 'react-bootstrap';
import BorrowableDetails from './BorrowableDetails';
import { PoolTokenType } from '../../impermax-router/interfaces';
import PoolTokenContext from '../../contexts/PoolToken';
import { useTotalBalanceUSD, useTWAPPrice, useOracleIsInitialized } from '../../hooks/useData';
import { formatUSD } from '../../utils/format';


export default function BorrowablesDetails() {
  const lpTokenLocked = useTotalBalanceUSD(PoolTokenType.Collateral);
  if (lpTokenLocked > 0) console.log("LP Tokens locked:", formatUSD(lpTokenLocked));
  return (
    <div className="borrowables-details">
      <Row>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
                <BorrowableDetails />
              </PoolTokenContext.Provider>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
                <BorrowableDetails />
              </PoolTokenContext.Provider>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}