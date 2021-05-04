import React from 'react';
import { useUserData, useBorrowPositions, useSupplyPositions, useAccountTotalValueLocked, useAccountTotalValueSupplied, useAccountTotalValueBorrowed } from '../../hooks/useAccountData';
import './index.scss';
import useAccount from '../../hooks/useAccount';
import { Card, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Address } from 'cluster';
import PairAddressContext from '../../contexts/PairAddress';
import LendingPoolsRow from '../LendingPoolsTable/LendingPoolsRow';
import BorrowPosition from './BorrowPosition';
import SupplyPosition from './SupplyPosition';
import { formatUSD } from '../../utils/format';
import { AccountOverallStats } from '../OverallStats';

export default function AccountPage() {
  const userData = useUserData();
  const borrowPositions = useBorrowPositions();
  const supplyPositions = useSupplyPositions();

  if (!borrowPositions || !supplyPositions) return (<div className="spinner-container">
    <Spinner animation="border" size="lg" />
  </div>);

  return (<>
    <AccountOverallStats/>
    { borrowPositions && borrowPositions.length > 0 && (
      <Container>
        <div className="positions-title">Borrow Positions</div>
        <Card className="positions">
          <Row className="positions-header row">
            <Col xs={9}>Market</Col>
            <Col xs={3} className="text-right">Net Balance</Col>
          </Row>
          {borrowPositions.map((pair: string, key: any) => {
            return (
              <PairAddressContext.Provider value={pair} key={key}>
                <BorrowPosition />
              </PairAddressContext.Provider>
            )
          })}
        </Card>
      </Container>
    ) }
    { supplyPositions && supplyPositions.length > 0 && (
      <Container>
        <div className="positions-title">Supply Positions</div>
        <Card className="positions">
          <Row className="positions-header row">
            <Col xs={9}>Market</Col>
            <Col xs={3} className="text-right">Supply Balance</Col>
          </Row>
          {supplyPositions.map((pair: string, key: any) => {
            return (
              <PairAddressContext.Provider value={pair} key={key}>
                <SupplyPosition />
              </PairAddressContext.Provider>
            )
          })}
        </Card>
      </Container>
    ) }
  </>);
}