import React from 'react';
import './index.scss';
import { Row, Col, Card } from 'react-bootstrap';
import BorrowableDetails from './BorrowableDetails';
import { PoolTokenType } from '../../impermax-router/interfaces';
import PoolTokenContext from '../../contexts/PoolToken';


interface BorrowablesDetailsProps {
  uniswapV2PairAddress: string;
}

export default function BorrowablesDetails(props: BorrowablesDetailsProps) {
  const { uniswapV2PairAddress } = props;

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