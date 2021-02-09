import useUrlGenerator from "../../hooks/useUrlGenerator";
import React, { useState, useEffect, useCallback } from "react";
import { BorrowableData, PoolTokenType } from "../../impermax-router/interfaces";
import useImpermaxRouter, { useRouterCallback } from "../../hooks/useImpermaxRouter";
import { Link } from "react-router-dom";
import { LendingPoolsCol } from "./LendingPoolsCol";
import { formatUSD, formatPercentage } from "../../utils/format";
import { useContext } from "../../contexts/Theme";
import usePairAddress from "../../hooks/usePairAddress";
import { useSupplyUSD, useTotalBorrowsUSD, useSupplyAPY, useBorrowAPY, useUnderlyingAddress, useSymbol } from "../../hooks/useData";

/**
 * Component for a single Lending Pool row.
 */
export default function LendingPoolsRow() {
  const { getIconByTokenAddress, getLendingPool } = useUrlGenerator();

  const uniswapV2PairAddress = usePairAddress();
  const tokenAAddress = useUnderlyingAddress(PoolTokenType.BorrowableA);
  const tokenBAddress = useUnderlyingAddress(PoolTokenType.BorrowableB);
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const supplyUSDA = useSupplyUSD(PoolTokenType.BorrowableA);
  const supplyUSDB = useSupplyUSD(PoolTokenType.BorrowableB);
  const totalBorrowsUSDA = useTotalBorrowsUSD(PoolTokenType.BorrowableA);
  const totalBorrowsUSDB = useTotalBorrowsUSD(PoolTokenType.BorrowableB);
  const supplyAPYA = useSupplyAPY(PoolTokenType.BorrowableA);
  const supplyAPYB = useSupplyAPY(PoolTokenType.BorrowableB);
  const borrowAPYA = useBorrowAPY(PoolTokenType.BorrowableA);
  const borrowAPYB = useBorrowAPY(PoolTokenType.BorrowableB);

  return (
    <Link to={getLendingPool(uniswapV2PairAddress)} className="row lending-pools-row">
      <div className="col-4">
        <div className="currency-name">
          <div className="combined">
            <div className="currency-overlapped">
              <img src={getIconByTokenAddress(tokenAAddress)} />
              <img src={getIconByTokenAddress(tokenBAddress)} />
            </div>
          {symbolA}/{symbolB}
          </div>
          <div>
            <div>
              <img className="currency-icon" src={getIconByTokenAddress(tokenAAddress)} />
              {symbolA}
            </div>
            <div>
              <img className="currency-icon" src={getIconByTokenAddress(tokenBAddress)} />
              {symbolB}
            </div>
          </div>
        </div>
      </div>
      <LendingPoolsCol valueA={formatUSD(supplyUSDA)} valueB={formatUSD(supplyUSDB)} />
      <LendingPoolsCol valueA={formatUSD(totalBorrowsUSDA)} valueB={formatUSD(totalBorrowsUSDB)} />
      <LendingPoolsCol valueA={formatPercentage(supplyAPYA)} valueB={formatPercentage(supplyAPYB)} />
      <LendingPoolsCol valueA={formatPercentage(borrowAPYA)} valueB={formatPercentage(borrowAPYB)} />
    </Link>
  );
}