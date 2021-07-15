
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import ERC20JSON from 'abis/contracts/IERC20.json';

const useERC20Contract = (address: string | undefined): Contract | null => {
  const {
    library,
    account
  } = useWeb3React<Web3Provider>();

  if (!library) return null;
  if (!account) return null;
  if (!address) return null;

  const erc20Contract = new Contract(address, ERC20JSON.abi, library.getSigner(account));

  return erc20Contract;
};

export default useERC20Contract;
