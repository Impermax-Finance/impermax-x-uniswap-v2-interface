import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../contexts/Language';
import Table from 'react-bootstrap/Table';
import phrases from './translations';
import './index.scss';
import { LendingPool } from '../../hooks/useContract';
import { BorrowableData, getBorrowablesData } from '../../utils/borrowableData';
import { Row, Col, Card } from 'react-bootstrap';
import useUrlGenerator from '../../hooks/useUrlGenerator';
import { formatPercentage, formatUSD } from '../../utils/format';
import { PoolToken } from '../../impermax-router';
import useImpermaxRouter from '../../hooks/useImpermaxRouter';

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
  uniswapV2PairAddress: string;
  poolToken: PoolToken;
}

/**
 * Generate the Currency Equity Details card, giving information about the suppy and rates for a particular currency in
 * the system.
 */
export function BorrowableDetails(props: BorrowableDetailsProps) {
  const { uniswapV2PairAddress, poolToken } = props;

  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  const { getIconByTokenAddress } = useUrlGenerator();
  const [borrowableData, setBorrowableData] = useState<BorrowableData>();
  const impermaxRouter = useImpermaxRouter();

  useEffect(() => {
    if (!impermaxRouter) return;
    impermaxRouter.getBorrowableData(uniswapV2PairAddress, poolToken).then((data) => {
      setBorrowableData(data);
    });
  }, [impermaxRouter]);

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