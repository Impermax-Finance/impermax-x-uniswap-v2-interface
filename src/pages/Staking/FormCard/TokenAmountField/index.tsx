
import * as React from 'react';
import clsx from 'clsx';

import ImpermaxInput, { Props as ImpermaxInputProps } from 'components/UI/ImpermaxInput';

interface CustomProps {
  balance: number | undefined;
  allowance: number | undefined;
  error?: boolean;
  helperText?: React.ReactNode | string;
  tokenUnit: string;
  walletActive: boolean;
}

type Ref = HTMLInputElement;
const TokenAmountField = React.forwardRef<Ref, CustomProps & ImpermaxInputProps>(({
  className,
  balance,
  allowance,
  error,
  helperText,
  tokenUnit,
  walletActive,
  ...rest
}, ref): JSX.Element => {
  let balanceLabel;
  let allowanceLabel;
  if (walletActive) {
    balanceLabel =
      balance === undefined ?
        'Loading...' :
        `${balance} ${tokenUnit}`;
    allowanceLabel = allowance ?? 'Loading...';
  } else {
    balanceLabel = '-';
    allowanceLabel = '-';
  }

  return (
    <div className='space-y-0.5'>
      <div
        className={clsx(
          'flex',
          'rounded-md'
        )}>
        <ImpermaxInput
          ref={ref}
          className={clsx(
            'h-14',
            'text-2xl',
            'shadow-none',
            'rounded-r-none',
            className
          )}
          title='Token Amount'
          type='number'
          step='any'
          pattern='[-+]?[0-9]*[.,]?[0-9]+'
          placeholder='0.00'
          min={0}
          minLength={1}
          maxLength={79}
          spellCheck='false'
          {...rest} />
        <div
          style={{
            minWidth: 160
          }}
          className={clsx(
            'rounded-r-md',
            'inline-flex',
            'flex-col',
            'justify-center',
            'px-3',
            'py-2',
            'text-textSecondary',
            'text-xs',
            'border',
            'border-l-0',
            'border-gray-300',
            'bg-impermaxBlackHaze',
            'whitespace-nowrap',
            'select-none'
          )}>
          <span
            className={clsx(
              'truncate',
              'font-medium'
            )}>
            {`Balance: ${balanceLabel}`}
          </span>
          <span
            className={clsx(
              'truncate',
              'font-medium'
            )}>
            Allowance: {allowanceLabel}
          </span>
        </div>
      </div>
      <TokenAmountFieldHelperText
        className={clsx(
          'h-6',
          'flex',
          'items-center',
          { 'text-impermaxCarnation': error }
        )}>
        {helperText}
      </TokenAmountFieldHelperText>
    </div>
  );
});
TokenAmountField.displayName = 'TokenAmountField';

const TokenAmountFieldHelperText = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p
    className={clsx(
      'text-sm',
      className
    )}
    {...rest} />
);

export default TokenAmountField;
