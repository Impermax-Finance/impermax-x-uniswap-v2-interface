import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import './index.scss';
import { useListedPairs } from '../../hooks/useNetwork';
import LendingPoolsRow from './LendingPoolsRow';
import PairAddressContext from '../../contexts/PairAddress';
import QuestionHelper from '../QuestionHelper';

/**
 * Generate a searchable lending pools table.
 */
export function LendingPoolsTable() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const listedPairs = useListedPairs();

  const t = (s: string) => (phrases[s][language]);
  return (<div className="lending-pools-table">
    <div className="lending-pools-header row">
      <div className="col-4">{t("Market")}</div>
      <div className="col">{t("Total Supply")}</div>
      <div className="col">{t("Total Borrowed")}</div>
      <div className="col">{t("Supply APY")}</div>
      <div className="col">{t("Borrow APY")}</div>
      <div className="col-2 text-center">{t("Leveraged LP APY")} <QuestionHelper placement="left" text={"Based on last 7 days trading fees assuming a 5x leverage"} /></div>
    </div>
    {listedPairs.map((pair: string, key: any) => {
      return (
        <PairAddressContext.Provider value={pair} key={key}>
          <LendingPoolsRow />
        </PairAddressContext.Provider>
      )
    })}
  </div>)
}