
// ray test touch <<
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
// ray test touch >>
import clsx from 'clsx';
import { useMedia } from 'react-use';

import LendingPool from './LendingPool';
import LendingPoolsHeader from './LendingPoolsHeader';
import PairAddressContext from 'contexts/PairAddress';
import { usePairList } from 'hooks/useData';
// ray test touch <<
import useLendingPools from 'services/hooks/use-lending-pools';
// ray test touch >>
// ray test touch <<
import getUniswapAPY from 'services/get-uniswap-apy';
import {
  Address,
  LendingPoolData
} from 'impermax-router/interfaces';
// ray test touch >>
import { BREAKPOINTS } from 'utils/constants/styles';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

const LendingPools = (): JSX.Element => {
  // ray test touch <<
  const { chainId } = useWeb3React<Web3Provider>();
  if (!chainId) {
    throw new Error('Invalid Chain ID!');
  }
  const [lendingPoolsData, setLendingPoolsData] = React.useState<{ [key in Address]: LendingPoolData }>();
  // ray test touch >>
  const greaterThanMd = useMedia(`(min-width: ${BREAKPOINTS.md})`);
  // ray test touch <<
  const lendingPools = useLendingPools(); // TODO: directly write the hook here for managing statuses
  const pairList = usePairList();
  console.log('ray : ***** pairList => ', pairList);
  console.log('ray : ***** lendingPools => ', lendingPools);
  // ray test touch >>

  // ray test touch <<
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
        // TODO: should add error handling UX
        console.log('[LendingPools useEffect] error.message => ', error.message);
      }
    })();
  }, [lendingPools]);
  // ray test touch >>

  // ray test touch <<
  if (!lendingPools || !lendingPoolsData) {
  // ray test touch >>
    // TODO: should add loading UX
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
      {/* ray test touch << */}
      {lendingPools.map(lendingPool => {
        return (
          <PairAddressContext.Provider
            value={lendingPool.id}
            key={lendingPool.id}>
            <LendingPool
              // ray test touch <<
              chainID={chainId}
              lendingPoolsData={lendingPoolsData}
              // ray test touch >>
              lendingPool={lendingPool}
              greaterThanMd={greaterThanMd} />
          </PairAddressContext.Provider>
        );
      })}
      {/* {pairList.map((pair: string, index: number) => {
        return (
          <PairAddressContext.Provider
            value={pair}
            key={index}>
            <LendingPool
              greaterThanMd={greaterThanMd} />
          </PairAddressContext.Provider>
        );
      })} */}
      {/* ray test touch >> */}
    </div>
  );
};

export default LendingPools;
