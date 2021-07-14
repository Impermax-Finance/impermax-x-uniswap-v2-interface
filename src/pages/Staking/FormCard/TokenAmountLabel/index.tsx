
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import clsx from 'clsx';

import ImpermaxCarnationBadge from 'components/badges/ImpermaxCarnationBadge';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import PoolTokenJSON from 'abis/contracts/IPoolToken.json';
import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imx';

const useXIMXContract = () => {
  const {
    chainId,
    library,
    account
  } = useWeb3React<Web3Provider>();

  if (!chainId) return null;
  if (!library) return null;
  if (!account) return null;

  const signer = library.getSigner(account);
  const xIMXAddress = X_IMX_ADDRESSES[chainId];

  if (!xIMXAddress) {
    throw new Error('Undefined xIMX address!');
  }

  const xIMXContract =
    new Contract(xIMXAddress, PoolTokenJSON.abi, signer);

  return xIMXContract;
};

interface CustomProps {
  text: string;
}

const TokenAmountLabel = ({
  text,
  className,
  ...rest
}: CustomProps & Omit<React.ComponentPropsWithRef<'label'>, 'children'>): JSX.Element => {
  const xIMXContract = useXIMXContract();
  const [xIMXRate, setXIMXRate] = React.useState<number>();
  React.useEffect(() => {
    if (!xIMXContract) return;

    (async () => {
      try {
        const bigXIMXRate: BigNumber = await xIMXContract.callStatic.exchangeRate();
        const floatXIMXRate = parseFloat(formatUnits(bigXIMXRate));
        const theXIMXRate = formatNumberWithFixedDecimals(floatXIMXRate, 5);
        setXIMXRate(theXIMXRate);
      } catch (error) {
        console.log('[TokenAmountLabel useEffect] error.message => ', error.message);
      }
    })();
  }, [xIMXContract]);

  return (
    <label
      className={clsx(
        'flex',
        'justify-between',
        'items-center',
        className
      )}
      {...rest}>
      <span
        className={clsx(
          'text-2xl',
          'font-medium'
        )}>
        {text}
      </span>
      <ImpermaxCarnationBadge>1 xIMX = {xIMXRate} IMX</ImpermaxCarnationBadge>
    </label>
  );
};

export default TokenAmountLabel;
