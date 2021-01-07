import React from 'react';
import View from '../components/View';
import LendingPoolsSearch from '../components/LendingPoolsSearch';
import AccountLendingPool from '../components/AccountLendingPool';

/**
 * Home page view.
 */
export default function Home() {
  return (<View>
      <div className="main-view">
        <LendingPoolsSearch />
        <AccountLendingPool />
      </div>
    </View>
  );
}
