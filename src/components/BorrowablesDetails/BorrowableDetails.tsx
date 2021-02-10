import React, { useContext } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Table } from "react-bootstrap";
import { formatUSD, formatPercentage } from "../../utils/format";
import BorrowableDetailsRow from "./BorrowableDetailsRow";
import { useSymbol, useName, useUnderlyingAddress, useSupplyUSD, useTotalBorrowsUSD, useUtilizationRate, useSupplyAPY, useBorrowAPY } from "../../hooks/useData";
import { useTokenIcon } from "../../hooks/useUrlGenerator";

/**
 * Generate the Currency Equity Details card, giving information about the suppy and rates for a particular currency in
 * the system.
 */
export default function BorrowableDetails() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const tokenAddress = useUnderlyingAddress();
  const name = useName();
  const symbol = useSymbol();
  const supplyUSD = useSupplyUSD();
  const totalBorrowsUSD = useTotalBorrowsUSD();
  const utilizationRate = useUtilizationRate();
  const supplyAPY = useSupplyAPY();
  const borrowAPY = useBorrowAPY();
  const tokenIcon = useTokenIcon();

  return (<div className="borrowable-details"> 
    <div className="header">
      <img className="currency-icon" src={tokenIcon} />
      {name} ({symbol})
    </div>
    <Table>
      <tbody>
        <BorrowableDetailsRow name={t("Total Supply")} value={formatUSD(supplyUSD)} />
        <BorrowableDetailsRow name={t("Total Borrow")} value={formatUSD(totalBorrowsUSD)} />
        <BorrowableDetailsRow name={t("Utilization Rate")} value={formatPercentage(utilizationRate)} />
        <BorrowableDetailsRow name={t("Supply APY")} value={formatPercentage(supplyAPY)} />
        <BorrowableDetailsRow name={t("Borrow APY")} value={formatPercentage(borrowAPY)} />
      </tbody>  
    </Table>
  </div>);
}