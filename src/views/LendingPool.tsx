import React from 'react';
import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountLendingPool from '../components/AccountLendingPool';
import BorrowablesDetails from '../components/BorrowablesDetails';
import { Container } from 'react-bootstrap';

/**
 * LendingPool page view.
 */
export default function LendingPool() {
  const { uniswapV2PairAddress } = useParams<{ uniswapV2PairAddress: string }>();

  return (<View>
    <Container className="lending-pool">
      <BorrowablesDetails uniswapV2PairAddress={uniswapV2PairAddress} />
      <AccountLendingPool uniswapV2PairAddress={uniswapV2PairAddress} />
    </Container>
  </View>);
}