
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';
import { useMedia } from 'react-use';

import LendingPool from './LendingPool';
import LendingPoolsHeader from './LendingPoolsHeader';
import PairAddressContext from 'contexts/PairAddress';
import useLendingPools from 'services/hooks/use-lending-pools';
import getUniswapAPY from 'services/get-uniswap-apy';
// ray test touch <<
import {
  Address,
  LendingPoolData
} from 'impermax-router/interfaces';
// import { usePairList } from 'hooks/useData';
// ray test touch >>
import { BREAKPOINTS } from 'utils/constants/styles';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

const LendingPools = (): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();

  if (!chainId) {
    throw new Error('Invalid Chain ID!');
  }

  const [lendingPoolsData, setLendingPoolsData] = React.useState<{ [key in Address]: LendingPoolData }>();
  const greaterThanMd = useMedia(`(min-width: ${BREAKPOINTS.md})`);
  // ray test touch <<
  const lendingPools = useLendingPools(); // TODO: directly write the hook here for managing statuses
  // ray test touch >>

  React.useEffect(() => {
    if (!lendingPools) return;

    (async () => {
      try {
        const uniswapV2PairAddresses = lendingPools.map(lendingPool => lendingPool.id);
        const uniswapAPYs = await getUniswapAPY(uniswapV2PairAddresses);

        const theLendingPoolsData: { [key in Address]: LendingPoolData } = {};
        for (const lendingPool of lendingPools) {
          theLendingPoolsData[lendingPool.id] = lendingPool;
          theLendingPoolsData[lendingPool.id].pair.uniswapAPY = uniswapAPYs[lendingPool.id];
        }

        setLendingPoolsData(theLendingPoolsData);
      } catch (error) {
        // ray test touch <<
        // TODO: should add error handling UX
        // ray test touch >>
        console.log('[LendingPools useEffect] error.message => ', error.message);
      }
    })();
  }, [lendingPools]);

  if (!lendingPools || !lendingPoolsData) {
    // ray test touch <<
    // TODO: should add loading UX
    // ray test touch >>
    return (
      <div
        className={clsx(
          'p-7',
          'flex',
          'justify-center'
        )}>
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-8',
            'h-8',
            'text-impermaxJade'
          )} />
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {greaterThanMd && (
        <LendingPoolsHeader className='px-4' />
      )}
      {lendingPools.map(lendingPool => {
        return (
          <PairAddressContext.Provider
            value={lendingPool.id}
            key={lendingPool.id}>
            <LendingPool
              chainID={chainId}
              lendingPoolsData={lendingPoolsData}
              lendingPool={lendingPool}
              greaterThanMd={greaterThanMd} />
          </PairAddressContext.Provider>
        );
      })}
    </div>
  );
};

export default LendingPools;
