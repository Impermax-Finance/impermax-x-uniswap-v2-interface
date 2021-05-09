// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import {
  useBorrowPositions,
  useSupplyPositions
} from '../../hooks/useAccountData';
import './index.scss';
import { Card, Spinner, Container, Row, Col } from 'react-bootstrap';
import PairAddressContext from '../../contexts/PairAddress';
import BorrowPosition from './BorrowPosition';
import SupplyPosition from './SupplyPosition';
import { AccountOverallStats } from '../OverallStats';

export default function AccountPage(): JSX.Element {
  // ray test touch <
  // const userData = useUserData();
  // ray test touch >
  const borrowPositions = useBorrowPositions();
  const supplyPositions = useSupplyPositions();

  if (!borrowPositions || !supplyPositions) {
    return (
      <div className='spinner-container'>
        <Spinner
          animation='border'
          size='lg' />
      </div>
    );
  }

  return (
    <>
      <AccountOverallStats />
      {borrowPositions && borrowPositions.length > 0 && (
        <Container>
          <div className='positions-title'>Borrow Positions</div>
          <Card className='positions'>
            <Row className='positions-header row'>
              <Col xs={9}>Market</Col>
              <Col
                xs={3}
                className='text-right'>Net Balance
              </Col>
            </Row>
            {borrowPositions.map((pair: string, key: any) => {
              return (
                <PairAddressContext.Provider
                  value={pair}
                  key={key}>
                  <BorrowPosition />
                </PairAddressContext.Provider>
              );
            })}
          </Card>
        </Container>
      )}
      {supplyPositions && supplyPositions.length > 0 && (
        <Container>
          <div className='positions-title'>Supply Positions</div>
          <Card className='positions'>
            <Row className='positions-header row'>
              <Col xs={9}>Market</Col>
              <Col
                xs={3}
                className='text-right'>Supply Balance
              </Col>
            </Row>
            {supplyPositions.map((pair: string, key: any) => {
              return (
                <PairAddressContext.Provider
                  value={pair}
                  key={key}>
                  <SupplyPosition />
                </PairAddressContext.Provider>
              );
            })}
          </Card>
        </Container>
      )}
    </>
  );
}
