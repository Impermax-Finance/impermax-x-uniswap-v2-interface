import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useTotalValueLocked, useTotalValueSupplied, useTotalValueBorrowed } from '../../hooks/useData';
import { formatUSD } from '../../utils/format';
import './index.scss';

/**
 * Creates a searchable list of Lending Pools.
 */
export default function OverallStats() {
  const totalValueLocked = useTotalValueLocked();
  const totalValueSupplied = useTotalValueSupplied();
  const totalValueBorrowed = useTotalValueBorrowed();

  return(<Container className="overall-stats">
    <Card>
      <Row>
        <Col xs={12} md={4} className="col">
          <div className="name">Total value locked:</div>
          <div className="value">{ formatUSD(totalValueLocked) }</div>
        </Col>
        <Col xs={12} md={4} className="col">
          <div className="name">Total supplied:</div>
          <div className="value">{ formatUSD(totalValueSupplied) }</div>
        </Col>
        <Col xs={12} md={4} className="col">
          <div className="name">Total borrowed:</div>
          <div className="value">{ formatUSD(totalValueBorrowed) }</div>
        </Col>
      </Row>
    </Card>
  </Container>);
}