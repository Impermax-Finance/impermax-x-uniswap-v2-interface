import React, { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import useUrlGenerator from "../../hooks/useUrlGenerator";
import useImpermaxRouter from "../../hooks/useImpermaxRouter";
import { Table } from "react-bootstrap";
import { formatUSD, formatPercentage } from "../../utils/format";
import { PoolToken, BorrowableData } from "../../impermax-router";
import BorrowableDetailsRow from "./BorrowableDetailsRow";

interface BorrowableDetailsProps {
  uniswapV2PairAddress: string;
  poolToken: PoolToken;
}

/**
 * Generate the Currency Equity Details card, giving information about the suppy and rates for a particular currency in
 * the system.
 */
export default function BorrowableDetails(props: BorrowableDetailsProps) {
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