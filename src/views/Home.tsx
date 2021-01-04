import React from 'react';
import View from '../components/View';
import LendingPoolsSearch from '../components/LendingPoolsSearch';

/**
 * Home page view.
 */
export default function Home() {
  return (<View>
      <div className="main-view">
        <LendingPoolsSearch />
      </div>
    </View>
  );
}
