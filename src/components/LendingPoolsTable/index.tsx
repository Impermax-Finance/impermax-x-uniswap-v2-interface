import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table'
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import { Currency, DAI, ETH } from './../../utils/currency';
import './index.scss';

interface LendingCurrencyData {
  currency: Currency;
  supply: string;
  borrowed: string;
  supplyAPY: string;
  borrowAPY: string;
  farmingAPY: string;
}

interface LendingPoolsRowProps {
  currency1: LendingCurrencyData;
  currency2: LendingCurrencyData;
}

/**
 * Component for a single Lending Pool row.
 */
export function LendingPoolsRow(props: LendingPoolsRowProps) {

  const { currency1, currency2 } = props;

  return (<tr className="lending-pools-row">
    <td className="currency-name">
      <span className="combined">{currency1.currency.name}/{currency2.currency.name}</span>
      <span>
        <div>
            <img className="currency-icon" src={currency1.currency.icon} />
            {currency1.currency.name}
        </div>
        <div>
            <img className="currency-icon" src={currency2.currency.icon} />
            {currency2.currency.name}
        </div>
      </span>
    </td>
    <td>
      <div>
        {currency1.supply}
      </div>
      <div>
        {currency2.supply}
      </div>
    </td>
    <td>
      <div>
        {currency1.borrowed}
      </div>
      <div>
        {currency2.borrowed}
      </div>
    </td>
    <td>
      <div>
        {currency1.supplyAPY}
      </div>
      <div>
        {currency2.supplyAPY}
      </div>
    </td>
    <td>
      <div>
        {currency1.borrowAPY}
      </div>
      <div>
        {currency2.borrowAPY}
      </div>
    </td>
    <td>
      <div>
        {currency1.farmingAPY}
      </div>
      <div>
        {currency2.farmingAPY}
      </div>
    </td>
  </tr>);
}

/**
 * Generate a searchable lending pools table.
 */
export function LendingPoolsTable() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;

  const DaiLendingCurrencyData: LendingCurrencyData = {
    currency: DAI,
    supply: "$12.38M",
    borrowed: "$12.38M",
    supplyAPY: "8.34%",
    borrowAPY: "12.06%",
    farmingAPY: "15.23%"
  };

  const EthLendingCurrencyData: LendingCurrencyData = {
    currency: ETH,
    supply: "$12.38M",
    borrowed: "$2.72M",
    supplyAPY: "8.34%",
    borrowAPY: "12.06%",
    farmingAPY: "15.23%"
  }

  const t = (s: string) => (phrases[s][language]);
  return (<div className="lending-pools-table">
    <Table>
      <thead>
        <tr>
          <th>{t("Market")}</th>
          <th>{t("Total Supply")}</th>
          <th>{t("Total Borrowed")}</th>
          <th>{t("Supply APY")}</th>
          <th>{t("Borrow APY")}</th>
          <th>{t("Farming APY")}</th>
        </tr>
      </thead>
      <tbody>
        <LendingPoolsRow
          currency1={DaiLendingCurrencyData}
          currency2={EthLendingCurrencyData} />
      </tbody>
    </Table>
  </div>)
}