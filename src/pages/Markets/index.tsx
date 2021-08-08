
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import OverallStats from './OverallStats';
import ActionBar from './ActionBar';
import LendingPoolList from './LendingPoolList';
import { SUPPORTED_CHAIN_IDS } from 'config/web3/chains';
import { PARAMETERS } from 'utils/constants/links';

const Markets = (): JSX.Element => {
  const { chainId = SUPPORTED_CHAIN_IDS[0] } = useWeb3React<Web3Provider>();

  // ray test touch <<
  const { [PARAMETERS.CHAIN_ID]: selectedChainID } = useParams<Record<string, string>>();
  console.log('ray : ***** selectedChainID => ', selectedChainID);
  // ray test touch >>

  return (
    <div
      className={clsx(
        'space-y-12',
        'py-6'
      )}>
      <OverallStats chainID={chainId} />
      <ActionBar />
      <LendingPoolList chainID={chainId} />
    </div>
  );
};

export default Markets;
