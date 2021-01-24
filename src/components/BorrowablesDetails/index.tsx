import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/Language';
import Table from 'react-bootstrap/Table';
import { Currency } from '../../utils/currency';
import phrases from './translations';
import './index.scss';

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

interface BorrowablesDetailsProps {
  currency: Currency;
  supply: string;
  borrowed: string;
  supplyAPY: string;
  borrowAPY: string;
  utilizationRate: string;
}

/**
 * Generate the Currency Equity Details card, giving information about the suppy and rates for a particular currency in
 * the system.
 */
export default function BorrowablesDetails(props: BorrowablesDetailsProps) {
  const { currency, supply, borrowed, supplyAPY, borrowAPY, utilizationRate } = props;
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  return (<div className="currency-equity-details">
    <div className="header">
      <img className="currency-icon" src={currency.icon} />
      {currency.name}
    </div>
    <Table>
      <tbody>
        <BorrowableDetailsRow value={t("Total Supply")} amount={supply} />
        <BorrowableDetailsRow value={t("Total Borrow")} amount={borrowed} />
        <BorrowableDetailsRow value={t("Utilization Rate")} amount={utilizationRate} />
        <BorrowableDetailsRow value={t("Supply APY")} amount={supplyAPY} />
        <BorrowableDetailsRow value={t("Borrow APY")} amount={borrowAPY} />
      </tbody>  
    </Table>
  </div>);
}