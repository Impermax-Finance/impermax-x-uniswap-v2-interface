import React from 'react';
import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountLendingPool from '../components/AccountLendingPool';
import { SupportedLPs } from '../utils/currency';

/**
 * LendingPool page view.
 */
export default function LendingPool() {
  const { uniswapV2Pair } = useParams<{ uniswapV2Pair: string }>();
  const lptoken = SupportedLPs['eth-dai'];
  return (<View>
    <div className="farm">
      <AccountLendingPool lptoken={lptoken} />
    </div>
  </View>);
}