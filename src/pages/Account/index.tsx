
import { useParams } from 'react-router-dom';

import AccountContent from './AccountContent';
import Layout from 'parts/Layout';
import { AccountContext } from 'contexts/AccountProvider';

const Account = (): JSX.Element => {
  const { account } = useParams<{ account: string }>();

  return (
    <Layout>
      <AccountContext.Provider value={account}>
        <AccountContent />
      </AccountContext.Provider>
    </Layout>
  );
};

export default Account;
