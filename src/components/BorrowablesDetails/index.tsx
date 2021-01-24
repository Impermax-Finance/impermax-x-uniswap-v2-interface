import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../contexts/Language';
import Table from 'react-bootstrap/Table';
import { Currency } from '../../utils/currency';
import phrases from './translations';
import './index.scss';
import { LendingPool } from '../../hooks/useContract';
import { BorrowableData, getBorrowableData } from '../../utils/borrowableData';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getIconByTokenAddress } from '../../utils/icons';

interface RowProps {
  value: string;
  amount: string;
}

function BorrowableDetailsRow({ value, amount }: RowProps) {
  return (<tr>
    <td>{value}</td>
    <td>{amount}</td>
  </tr>);
}

interface BorrowableDetailsProps {
  borrowableData: BorrowableData;
}

/**
 * Generate the Currency Equity Details card, giving information about the suppy and rates for a particular currency in
 * the system.
 */
export function BorrowableDetails(props: BorrowableDetailsProps) {
  const { borrowableData } = props;
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  if (!borrowableData) return null;

  //TODO rename to borrowable
  return (<div className="borrowable-details"> 
    <div className="header">
      <img className="currency-icon" src={getIconByTokenAddress(borrowableData.tokenAddress)} />
      {borrowableData.name} ({borrowableData.symbol})
    </div>
    <Table>
      <tbody>
        <BorrowableDetailsRow value={t("Total Supply")} amount={borrowableData.supply} />
        <BorrowableDetailsRow value={t("Total Borrow")} amount={borrowableData.borrowed} />
        <BorrowableDetailsRow value={t("Utilization Rate")} amount={borrowableData.utilizationRate} />
        <BorrowableDetailsRow value={t("Supply APY")} amount={borrowableData.supplyAPY} />
        <BorrowableDetailsRow value={t("Borrow APY")} amount={borrowableData.borrowAPY} />
      </tbody>  
    </Table>
  </div>);
}

interface BorrowablesDetailsProps {
  lendingPool: LendingPool;
}

export default function BorrowablesDetails(props: BorrowablesDetailsProps) {
  const { lendingPool } = props;

  const [borrowableAData, setBorrowableAData] = useState<BorrowableData>();
  const [borrowableBData, setBorrowableBData] = useState<BorrowableData>();

  useEffect(() => {
    if (!lendingPool) return;
    getBorrowableData(lendingPool.tokenA, lendingPool.borrowableA).then((result) => setBorrowableAData(result));
    getBorrowableData(lendingPool.tokenB, lendingPool.borrowableB).then((result) => setBorrowableBData(result));
  }, [lendingPool]);

  return (
    <div className="borrowables-details">
      <Container>
        <Row>
          <Col sm={6}>
            <Card>
              <Card.Body>
                <BorrowableDetails borrowableData={borrowableAData} />
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6}>
            <Card>
              <Card.Body>
                <BorrowableDetails borrowableData={borrowableBData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}