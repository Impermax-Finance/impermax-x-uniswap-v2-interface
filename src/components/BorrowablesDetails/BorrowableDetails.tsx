import React, { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import useUrlGenerator from "../../hooks/useUrlGenerator";
import useImpermaxRouter, { useRouterUpdate } from "../../hooks/useImpermaxRouter";
import { Table } from "react-bootstrap";
import { formatUSD, formatPercentage } from "../../utils/format";
import { PoolTokenType, BorrowableData } from "../../impermax-router/interfaces";
import BorrowableDetailsRow from "./BorrowableDetailsRow";
import usePairAddress from "../../hooks/usePairAddress";
import usePoolToken from "../../hooks/usePoolToken";

/**
 * Generate the Currency Equity Details card, giving information about the suppy and rates for a particular currency in
 * the system.
 */
export default function BorrowableDetails() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  const { getIconByTokenAddress } = useUrlGenerator();

  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const [borrowableData, setBorrowableData] = useState<BorrowableData>();
  const impermaxRouter = useImpermaxRouter();
  const routerUpdate = useRouterUpdate();

  useEffect(() => {
    if (!impermaxRouter) return;
    impermaxRouter.getBorrowableData(uniswapV2PairAddress, poolTokenType).then((data) => {
      setBorrowableData(data);
    });
  }, [impermaxRouter, routerUpdate]);

  if (!borrowableData) return null;

  return (<div className="borrowable-details"> 
    <div className="header">
      <img className="currency-icon" src={getIconByTokenAddress(borrowableData.tokenAddress)} />
      {borrowableData.name} ({borrowableData.symbol})
    </div>
    <Table>
      <tbody>
        <BorrowableDetailsRow name={t("Total Supply")} value={formatUSD(borrowableData.supplyUSD)} />
        <BorrowableDetailsRow name={t("Total Borrow")} value={formatUSD(borrowableData.totalBorrowsUSD)} />
        <BorrowableDetailsRow name={t("Utilization Rate")} value={formatPercentage(borrowableData.utilizationRate)} />
        <BorrowableDetailsRow name={t("Supply APY")} value={formatPercentage(borrowableData.supplyAPY)} />
        <BorrowableDetailsRow name={t("Borrow APY")} value={formatPercentage(borrowableData.borrowAPY)} />
      </tbody>  
    </Table>
  </div>);
}