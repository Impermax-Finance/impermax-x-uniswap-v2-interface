import React, { useContext, useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import './index.scss';
import { useLendingPool } from '../../hooks/useContract';
import { BorrowableData, PoolToken } from '../../impermax-router';
import useUrlGenerator from '../../hooks/useUrlGenerator';
import { formatPercentage, formatUSD } from '../../utils/format';
import { useListedPairs } from '../../hooks/useNetwork';
import useImpermaxRouter from '../../hooks/useImpermaxRouter';

interface LendingPoolsColProps {
  valueA: string;
  valueB: string;
}

export function LendingPoolsCol({valueA, valueB}: LendingPoolsColProps) {
  return (
    <div className="col">
      <div>
        {valueA}
      </div>
      <div>
        {valueB}
      </div>
    </div>
  );
}

interface LendingPoolsRowProps {
  uniswapV2PairAddress: string;
}

/**
 * Component for a single Lending Pool row.
 */
export function LendingPoolsRow(props: LendingPoolsRowProps) {
  const { uniswapV2PairAddress } = props;

  const { getIconByTokenAddress } = useUrlGenerator();
  const [borrowableAData, setBorrowableAData] = useState<BorrowableData>();
  const [borrowableBData, setBorrowableBData] = useState<BorrowableData>();
  const impermaxRouter = useImpermaxRouter();

  useEffect(() => {
    if (!impermaxRouter) return;
    impermaxRouter.getBorrowableData(uniswapV2PairAddress, PoolToken.BorrowableA).then((data) => {
      setBorrowableAData(data);
    });
    impermaxRouter.getBorrowableData(uniswapV2PairAddress, PoolToken.BorrowableB).then((data) => {
      setBorrowableBData(data);
    });
  }, [impermaxRouter]);

  if (!borrowableAData || !borrowableBData) return (<div>
    Loading
  </div>);

  return (
    <Link to={"lending-pool/" + uniswapV2PairAddress} className="row lending-pools-row">
      <div className="col-4">
        <div className="currency-name">
          <div className="combined">
            <div className="currency-overlapped">
              <img src={getIconByTokenAddress(borrowableAData.tokenAddress)} />
              <img src={getIconByTokenAddress(borrowableBData.tokenAddress)} />
            </div>
          {borrowableAData.symbol}/{borrowableBData.symbol}
          </div>
          <div>
            <div>
              <img className="currency-icon" src={getIconByTokenAddress(borrowableAData.tokenAddress)} />
              {borrowableAData.symbol}
            </div>
            <div>
              <img className="currency-icon" src={getIconByTokenAddress(borrowableBData.tokenAddress)} />
              {borrowableBData.symbol}
            </div>
          </div>
        </div>
      </div>
      <LendingPoolsCol valueA={formatUSD(borrowableAData.supplyUSD)} valueB={formatUSD(borrowableBData.supplyUSD)} />
      <LendingPoolsCol valueA={formatUSD(borrowableAData.borrowedUSD)} valueB={formatUSD(borrowableBData.borrowedUSD)} />
      <LendingPoolsCol valueA={formatPercentage(borrowableAData.supplyAPY)} valueB={formatPercentage(borrowableBData.supplyAPY)} />
      <LendingPoolsCol valueA={formatPercentage(borrowableAData.borrowAPY)} valueB={formatPercentage(borrowableBData.borrowAPY)} />
      {/*<LendingPoolsCol valueA={formatPercentage(borrowableAData.farmingAPY)} valueB={formatPercentage(borrowableBData.farmingAPY)} />*/}
    </Link>
  );
}

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
      {/*<div className="col">{t("Farming APY")}</div>*/}
    </div>
    {listedPairs.map((pair: string, key: any) =>    
      <LendingPoolsRow uniswapV2PairAddress={pair} key={key} />
    )}
  </div>)
}