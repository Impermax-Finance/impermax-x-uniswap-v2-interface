import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../contexts/Language';
import Table from 'react-bootstrap/Table';
import phrases from './translations';
import './index.scss';
import { LendingPool } from '../../hooks/useContract';
import { BorrowableData, getBorrowablesData } from '../../utils/borrowableData';
import { Row, Col, Card } from 'react-bootstrap';
import { getIconByTokenAddress } from '../../utils/urlGenerator';
import { formatPercentage, formatUSD } from '../../utils/format';

interface RowProps {
  name: string;
  value: string;
}

function BorrowableDetailsRow({ name, value }: RowProps) {
  return (<tr>
    <td>{name}</td>
    <td className="text-right">{value}</td>
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

  return (<div className="borrowable-details"> 
    <div className="header">
      <img className="currency-icon" src={getIconByTokenAddress(borrowableData.tokenAddress)} />
      {borrowableData.name} ({borrowableData.symbol})
    </div>
    <Table>
      <tbody>
        <BorrowableDetailsRow name={t("Total Supply")} value={formatUSD(borrowableData.supplyUSD)} />
        <BorrowableDetailsRow name={t("Total Borrow")} value={formatUSD(borrowableData.borrowedUSD)} />
        <BorrowableDetailsRow name={t("Utilization Rate")} value={formatPercentage(borrowableData.utilizationRate)} />
        <BorrowableDetailsRow name={t("Supply APY")} value={formatPercentage(borrowableData.supplyAPY)} />
        <BorrowableDetailsRow name={t("Borrow APY")} value={formatPercentage(borrowableData.borrowAPY)} />
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
    getBorrowablesData(lendingPool).then(({borrowableAData, borrowableBData}) => {
      setBorrowableAData(borrowableAData);
      setBorrowableBData(borrowableBData);
    });
  }, [lendingPool]);

  return (
    <div className="borrowables-details">
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
    </div>
  );
}