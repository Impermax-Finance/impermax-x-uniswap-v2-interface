import React from 'react';
import View from '../components/View';
import LendingPoolsSearch from '../components/LendingPoolsSearch';
import OverallStats from '../components/OverallStats';

/**
 * Home page view.
 */
export default function Home() {
  return (<View>
      <div className="home">
        {<OverallStats />}
        <LendingPoolsSearch />
      </div>
    </View>
  );
}
