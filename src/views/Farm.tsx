import React from 'react';
import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountLendingPool from '../components/AccountLendingPool';
import { SupportedLPs } from '../utils/currency';

/**
 * Farm page view.
 */
export default function Farm() {
  const { farmID } = useParams<{ farmID: string }>();
  const lptoken = SupportedLPs[farmID];
  return (<View>
    <div className="farm">
      <AccountLendingPool lptoken={lptoken} />
    </div>
  </View>);
}