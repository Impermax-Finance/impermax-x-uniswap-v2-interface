import View from '../components/View';
import { useParams } from 'react-router-dom';

import AccountContext from '../contexts/Account';
import AccountPage from '../components/AccountPage';

/**
 * Account page view.
 */

export default function Account() {
  const { account } = useParams<{ account: string }>();

  return (
    <View>
      <AccountContext.Provider value={account}>
        <AccountPage />
      </AccountContext.Provider>
    </View>
  );
}
