
import * as React from 'react';
import clsx from 'clsx';

import ImpermaxInput, { Props as ImpermaxInputProps } from 'components/UI/ImpermaxInput';

interface CustomProps {
  balance: number | undefined;
  error?: boolean;
  helperText?: React.ReactNode | string;
}

type Ref = HTMLInputElement;
const TokenAmountField = React.forwardRef<Ref, CustomProps & ImpermaxInputProps>(({
  className,
  balance,
  error,
  helperText,
  ...rest
}, ref): JSX.Element => {
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
          // ray test touch <<<
          inputMode='decimal'
          autoComplete='off'
          autoCorrect='off'
          type='text'
          pattern='^[0-9]*[.,]?[0-9]*$'
          // ray test touch >>>
          placeholder='0.00'
          min={0}
          minLength={1}
          maxLength={79}
          spellCheck='false'
          {...rest} />
        <span
          style={{
            minWidth: 120
          }}
          className={clsx(
            'rounded-r-md',
            'inline-flex',
            'items-center',
            'px-3',
            'py-2',
            'text-textSecondary',
            'text-sm',
            'border',
            'border-l-0',
            'border-gray-300',
            'bg-impermaxBlackHaze',
            'whitespace-nowrap'
          )}>
          Balance: {balance ?? 'Loading...'}
        </span>
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
