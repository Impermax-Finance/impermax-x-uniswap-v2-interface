import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/Language';
import Table from 'react-bootstrap/Table';
import { Currency } from './../../utils/currency';
import phrases from './translations';
import './index.scss';

interface RowProps {
  value: string;
  amount: string;
}

function CurrencyEquityRow({ value, amount }: RowProps) {
  return (<tr>
    <td>{value}</td>
    <td>{amount}</td>
  </tr>);
}

interface CurrencyEquityDetailsProps {
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
export default function CurrencyEquityDetails(props: CurrencyEquityDetailsProps) {
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
        <CurrencyEquityRow value={t("Total Supply")} amount={supply} />
        <CurrencyEquityRow value={t("Total Borrow")} amount={borrowed} />
        <CurrencyEquityRow value={t("Utilization Rate")} amount={utilizationRate} />
        <CurrencyEquityRow value={t("Supply APY")} amount={supplyAPY} />
        <CurrencyEquityRow value={t("Borrow APY")} amount={borrowAPY} />
      </tbody>  
    </Table>
  </div>);
}