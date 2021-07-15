
// ray test touch <<
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import Panel from 'components/Panel';
import getXIMXData from 'services/get-x-imx-data';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';

const APYCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();
  const [xIMXAPY, setXIMXAPY] = React.useState(0);
  React.useEffect(() => {
    if (!chainId) return;

    (async () => {
      try {
        const xIMXData = await getXIMXData(chainId);
        const theXIMXAPY = Math.pow(1 + parseFloat(xIMXData.dailyAPR), 365) - 1;
        setXIMXAPY(theXIMXAPY);
      } catch (error) {
        console.log('[APYCard useEffect] error.message => ', error.message);
      }
    })();
  }, [chainId]);

  const xIMXAPYInPercent = formatNumberWithFixedDecimals(xIMXAPY * 100, 2);

  return (
    <Panel
      className={clsx(
        'px-6',
        'py-4',
        'flex',
        'justify-between',
        'items-center',
        'bg-impermaxJade-200',
        className
      )}
      {...rest}>
      <div
        className={clsx(
          'text-base',
          'font-medium'
        )}>
        Staking APY
      </div>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'items-end',
          'space-y-1'
        )}>
        <span
          className={clsx(
            'font-bold',
            'text-2xl',
            'text-textPrimary'
          )}>
          {`${xIMXAPYInPercent} %`}
        </span>
        <span
          className={clsx(
            'text-sm',
            'text-textSecondary',
            'font-medium'
          )}>
          Staking APY
        </span>
      </div>
    </Panel>
  );
};

export default APYCard;
// ray test touch >>
