
import { useParams } from 'react-router-dom';

import AccountContent from './AccountContent';
import View from 'components/View';
import AccountContext from 'contexts/Account';

const Account = (): JSX.Element => {
  const { account } = useParams<{ account: string }>();

  return (
    <View>
      <AccountContext.Provider value={account}>
        <AccountContent />
      </AccountContext.Provider>
    </View>
  );
};

export default Account;
