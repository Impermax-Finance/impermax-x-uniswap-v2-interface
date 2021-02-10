import React from "react";
import { PoolTokenType } from "../../impermax-router/interfaces";
import { Link } from "react-router-dom";
import { LendingPoolsCol } from "./LendingPoolsCol";
import { formatUSD, formatPercentage } from "../../utils/format";
import { useContext } from "../../contexts/Theme";
import usePairAddress from "../../hooks/usePairAddress";
import { useSupplyUSD, useTotalBorrowsUSD, useSupplyAPY, useBorrowAPY, useSymbol } from "../../hooks/useData";
import { useTokenIcon, useLendingPoolUrl } from "../../hooks/useUrlGenerator";

/**
 * Component for a single Lending Pool row.
 */
export default function LendingPoolsRow() {
  const uniswapV2PairAddress = usePairAddress();
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
  const lendingPoolUrl = useLendingPoolUrl();
  const tokenIconA = useTokenIcon(PoolTokenType.BorrowableA);
  const tokenIconB = useTokenIcon(PoolTokenType.BorrowableB);

  return (
    <Link to={lendingPoolUrl} className="row lending-pools-row">
      <div className="col-4">
        <div className="currency-name">
          <div className="combined">
            <div className="currency-overlapped">
              <img src={tokenIconA} />
              <img src={tokenIconB} />
            </div>
          {symbolA}/{symbolB}
          </div>
          <div>
            <div>
              <img className="currency-icon" src={tokenIconA} />
              {symbolA}
            </div>
            <div>
              <img className="currency-icon" src={tokenIconB} />
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