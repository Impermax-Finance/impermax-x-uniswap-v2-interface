import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table'
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import { Currency } from './../../utils/currency';
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
  return (<tr>
    <td>1</td>
    <td>Mark</td>
    <td>Otto</td>
    <td>@mdo</td>
    <td>Otto</td>
    <td>@mdo</td>
  </tr>);
}

/**
 * Generate a searchable lending pools table.
 */
export function LendingPoolsTable() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;

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
      </tbody>
    </Table>
  </div>)
}