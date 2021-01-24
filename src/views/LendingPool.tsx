import React from 'react';
import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountLendingPool from '../components/AccountLendingPool';
import BorrowablesDetails from '../components/BorrowablesDetails';
import { useLendingPool } from '../hooks/useContract';

/**
 * LendingPool page view.
 */
export default function LendingPool() {
  const { uniswapV2PairAddress } = useParams<{ uniswapV2PairAddress: string }>();
  const lendingPool = useLendingPool(uniswapV2PairAddress);

  return (<View>
    <div className="lending-pool">
      <BorrowablesDetails lendingPool={lendingPool} />
      <AccountLendingPool lendingPool={lendingPool} />
    </div>
  </View>);
}