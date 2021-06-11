
import { useParams } from 'react-router-dom';

import AccountContent from './AccountContent';
import { AccountContext } from 'contexts/AccountProvider';
import { PARAMETERS } from 'utils/constants/links';
interface Params {
  [key: string]: string;
}

const Account = (): JSX.Element => {
  const { [PARAMETERS.ACCOUNT]: account } = useParams<Params>();

  return (
    <AccountContext.Provider value={account}>
      <AccountContent />
    </AccountContext.Provider>
  );
};

export default Account;
