import React from 'react';
import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountLendingPool from '../components/AccountLendingPool';
import { useLendingPool } from '../hooks/useContract';
//import { SupportedLPs } from '../utils/currency';

/**
 * LendingPool page view.
 */
export default function LendingPool() {
  const { uniswapV2PairAddress } = useParams<{ uniswapV2PairAddress: string }>();
  const lendingPool = useLendingPool(uniswapV2PairAddress);

  //const lptoken = SupportedLPs['eth-dai'];
  return (<View>
    <div className="lending-pool">
      <AccountLendingPool lendingPool={lendingPool} />
    </div>
  </View>);
}