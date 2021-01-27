import React from 'react';
import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountLendingPool from '../components/AccountLendingPool';
import BorrowablesDetails from '../components/BorrowablesDetails';
import { Container } from 'react-bootstrap';
import PairAddressContext from '../contexts/PairAddress';

/**
 * LendingPool page view.
 */
export default function LendingPool() {
  const { uniswapV2PairAddress } = useParams<{ uniswapV2PairAddress: string }>();

  return (<View>
    <Container className="lending-pool">
      <PairAddressContext.Provider value={uniswapV2PairAddress}>
        <BorrowablesDetails uniswapV2PairAddress={uniswapV2PairAddress} />
        <AccountLendingPool />
      </PairAddressContext.Provider>
    </Container>
  </View>);
}