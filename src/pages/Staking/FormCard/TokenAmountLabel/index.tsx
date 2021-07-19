
import * as React from 'react';
import { usePromise } from 'react-use';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import clsx from 'clsx';

import ImpermaxCarnationBadge from 'components/badges/ImpermaxCarnationBadge';
import ErrorFallback from 'components/ErrorFallback';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imxes';
import STATUSES from 'utils/constants/statuses';
import PoolTokenJSON from 'abis/contracts/IPoolToken.json';

const getXIMXContract = (xIMXAddress: string, library: Web3Provider) => {
  return new Contract(xIMXAddress, PoolTokenJSON.abi, library);
};

interface CustomProps {
  text: string;
}

const TokenAmountLabel = ({
  text,
  className,
  ...rest
}: CustomProps & Omit<React.ComponentPropsWithRef<'label'>, 'children'>): JSX.Element => {
  const {
    chainId,
    library
  } = useWeb3React<Web3Provider>();

  const handleError = useErrorHandler();
  const mounted = usePromise();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [xIMXRate, setXIMXRate] = React.useState<number>();

  React.useEffect(() => {
    if (!chainId) return;
    if (!library) return;
    if (!mounted) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const xIMXContract = getXIMXContract(X_IMX_ADDRESSES[chainId], library);
        const bigXIMXRate: BigNumber = await mounted(xIMXContract.callStatic.exchangeRate());
        const floatXIMXRate = parseFloat(formatUnits(bigXIMXRate));
        const theXIMXRate = formatNumberWithFixedDecimals(floatXIMXRate, 5);
        setXIMXRate(theXIMXRate);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    chainId,
    library,
    mounted,
    handleError
  ]);

  const loading = status === STATUSES.IDLE || status === STATUSES.PENDING;

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
      <ImpermaxCarnationBadge>1 xIMX = {loading ? 'Loading...' : xIMXRate} IMX</ImpermaxCarnationBadge>
    </label>
  );
};

export default withErrorBoundary(TokenAmountLabel, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
