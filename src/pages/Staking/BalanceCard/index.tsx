
import * as React from 'react';
import clsx from 'clsx';
// ray test touch <<<
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
// ray test touch >>>

import Panel from 'components/Panel';
import ImpermaxPicture from 'components/UI/ImpermaxPicture';
// ray test touch <<<
import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imxes';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
import getXIMXData from 'services/get-x-imx-data';
import getStakingUserData from 'services/get-staking-user-data';
// ray test touch >>>

const BalanceCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  // ray test touch <<<
  const {
    chainId,
    library,
    account
  } = useWeb3React<Web3Provider>();

  React.useEffect(() => {
    if (!chainId) return;
    if (!library) return;
    if (!account) return;

    (async () => {
      try {
        // Staked Balance
        const xIMXData = await getXIMXData(chainId);
        const xIMXRate = parseFloat(xIMXData.exchangeRate);
        const xIMXContract = getERC20Contract(X_IMX_ADDRESSES[chainId], library, account);
        const xIMXBalance: BigNumber = await xIMXContract.balanceOf(account);
        const xIMXDecimals = await xIMXContract.decimals();
        const floatXIMXBalance = parseFloat(formatUnits(xIMXBalance, xIMXDecimals));
        console.log('ray : ***** floatXIMXBalance => ', floatXIMXBalance);
        const stakedBalanceInIMX = floatXIMXBalance * xIMXRate;
        console.log('ray : ***** [Staked Balance] stakedBalanceInIMX => ', stakedBalanceInIMX);

        // Unstaked Balance
        const imxContract = getERC20Contract(IMX_ADDRESSES[chainId], library, account);
        const imxBalance: BigNumber = await imxContract.balanceOf(account);
        const imxDecimals = await imxContract.decimals();
        const floatIMXBalance = parseFloat(formatUnits(imxBalance, imxDecimals));
        console.log('ray : ***** [Unstaked Balance] floatIMXBalance => ', floatIMXBalance);

        // Earned
        const stakingUserData = await getStakingUserData(chainId, account);
        const totalEarned = parseFloat(stakingUserData.totalEarned);
        const anotherXIMXBalance = parseFloat(stakingUserData.ximxBalance);
        console.log('ray : ***** anotherXIMXBalance => ', anotherXIMXBalance);
        const lastExchangeRate = parseFloat(stakingUserData.lastExchangeRate);
        const earnedIMX = totalEarned + anotherXIMXBalance * (xIMXRate - lastExchangeRate);
        console.log('ray : ***** [Earned] earnedIMX => ', earnedIMX);
      } catch (error) {
        console.log('[BalanceCard] error.message => ', error.message);
      }
    })();
  }, [
    chainId,
    library,
    account
  ]);
  // ray test touch >>>

  return (
    <Panel
      className={clsx(
        'px-8',
        'py-7',
        'space-y-4',
        'bg-white',
        className
      )}
      {...rest}>
      <div className='space-y-3'>
        <h4
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          Staked Balance
        </h4>
        <div
          className={clsx(
            'flex',
            'items-center',
            'space-x-4'
          )}>
          <ImpermaxPicture
            images={[
              {
                type: 'image/avif',
                path: 'assets/images/imx-logos/imx-logo.avif'
              },
              {
                type: 'image/webp',
                path: 'assets/images/imx-logos/imx-logo.webp'
              },
              {
                type: 'image/png',
                path: 'assets/images/imx-logos/imx-logo.png'
              }
            ]}
            width={64}
            height={64}
            alt='IMX' />
          <div
            className={clsx(
              'inline-flex',
              'flex-col',
              'space-y-1'
            )}>
            <span className='font-medium'>_</span>
            <span>IMX</span>
          </div>
        </div>
      </div>
      <div className='space-y-3'>
        <h4
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          Unstaked Balance
        </h4>
        <div
          className={clsx(
            'flex',
            'items-center',
            'space-x-4'
          )}>
          <ImpermaxPicture
            images={[
              {
                type: 'image/avif',
                path: 'assets/images/ximx-logos/ximx-logo.avif'
              },
              {
                type: 'image/webp',
                path: 'assets/images/ximx-logos/ximx-logo.webp'
              },
              {
                type: 'image/png',
                path: 'assets/images/ximx-logos/ximx-logo.png'
              }
            ]}
            width={64}
            height={64}
            alt='xIMX' />
          <div
            className={clsx(
              'inline-flex',
              'flex-col',
              'space-y-1'
            )}>
            <span className='font-medium'>_</span>
            <span>IMX</span>
          </div>
        </div>
      </div>
      <div className='space-y-3'>
        <h4
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          Earned
        </h4>
        <div
          className={clsx(
            'flex',
            'items-center',
            'space-x-4'
          )}>
          <ImpermaxPicture
            images={[
              {
                type: 'image/avif',
                path: 'assets/images/ximx-logos/ximx-logo.avif'
              },
              {
                type: 'image/webp',
                path: 'assets/images/ximx-logos/ximx-logo.webp'
              },
              {
                type: 'image/png',
                path: 'assets/images/ximx-logos/ximx-logo.png'
              }
            ]}
            width={64}
            height={64}
            alt='xIMX' />
          <div
            className={clsx(
              'inline-flex',
              'flex-col',
              'space-y-1'
            )}>
            <span className='font-medium'>_</span>
            <span>IMX</span>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default BalanceCard;
