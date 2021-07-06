
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
    <div className='space-y-12'>
      <AccountContext.Provider value={account}>
        <AccountContent />
      </AccountContext.Provider>
    </div>
  );
};

export default Account;
