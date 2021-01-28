import useUrlGenerator from "../../hooks/useUrlGenerator";
import React, { useState, useEffect, useCallback } from "react";
import { BorrowableData, PoolTokenType } from "../../impermax-router/interfaces";
import useImpermaxRouter from "../../hooks/useImpermaxRouter";
import { Link } from "react-router-dom";
import { LendingPoolsCol } from "./LendingPoolsCol";
import { formatUSD, formatPercentage } from "../../utils/format";
import { useContext } from "../../contexts/Theme";
import usePairAddress from "../../hooks/usePairAddress";

/**
 * Component for a single Lending Pool row.
 */
export default function LendingPoolsRow() {
  const uniswapV2PairAddress = usePairAddress();
  const { getIconByTokenAddress, getLendingPool } = useUrlGenerator();
  const [borrowableAData, setBorrowableAData] = useState<BorrowableData>();
  const [borrowableBData, setBorrowableBData] = useState<BorrowableData>();
  const impermaxRouter = useImpermaxRouter();

  useEffect(() => {
    if (!impermaxRouter) return;
    impermaxRouter.getBorrowableData(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setBorrowableAData(data));
    impermaxRouter.getBorrowableData(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setBorrowableBData(data));
  }, [impermaxRouter]);

  if (!borrowableAData || !borrowableBData) return (<div>
    Loading
  </div>);

  return (
    <Link to={getLendingPool(uniswapV2PairAddress)} className="row lending-pools-row">
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