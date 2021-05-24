
import { useParams } from 'react-router-dom';

import AccountContent from './AccountContent';
import Layout from 'parts/Layout';
import { AccountContext } from 'contexts/AccountProvider';
import { PARAMETERS } from 'utils/constants/links';
interface Params {
  [key: string]: string;
}

const Account = (): JSX.Element => {
  const { [PARAMETERS.ACCOUNT]: account } = useParams<Params>();

  return (
    <Layout>
      <AccountContext.Provider value={account}>
        <AccountContent />
      </AccountContext.Provider>
    </Layout>
  );
};

export default Account;
