import React from 'react';
import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountLendingPool from '../components/AccountLendingPool';
//import { SupportedLPs } from '../utils/currency';

/**
 * LendingPool page view.
 */
export default function LendingPool() {
  const { uniswapV2PairAddress } = useParams<{ uniswapV2PairAddress: string }>();
  //const lptoken = SupportedLPs['eth-dai'];
  return (<View>
    <div className="farm">
      <AccountLendingPool uniswapV2PairAddress={uniswapV2PairAddress} />
    </div>
  </View>);
}