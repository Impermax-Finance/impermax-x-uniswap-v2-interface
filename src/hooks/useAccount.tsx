import { useContext } from 'react';
import AccountContext from '../contexts/Account';

export default function useAccount() {
  const account = useContext(AccountContext);
  return account;
}
