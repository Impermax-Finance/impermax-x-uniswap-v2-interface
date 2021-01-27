import React from 'react';
import './index.scss';
import { Row, Col, Card } from 'react-bootstrap';
import BorrowableDetails from './BorrowableDetails';
import { PoolToken } from '../../impermax-router';


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
              <BorrowableDetails uniswapV2PairAddress={uniswapV2PairAddress} poolToken={PoolToken.BorrowableA} />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <BorrowableDetails uniswapV2PairAddress={uniswapV2PairAddress} poolToken={PoolToken.BorrowableB} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}