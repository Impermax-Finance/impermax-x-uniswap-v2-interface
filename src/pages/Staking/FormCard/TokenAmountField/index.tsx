
// ray test touch <<
import clsx from 'clsx';

import ImpermaxInput, { Props as ImpermaxInputProps } from '../../../../components/UI/ImpermaxInput';

const TokenAmountField = ({
  className,
  ...rest
}: ImpermaxInputProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'flex',
        'rounded-md'
      )}>
      <ImpermaxInput
        className={clsx(
          'h-14',
          'text-2xl',
          'shadow-none',
          'rounded-r-none',
          className
        )}
        inputMode='decimal'
        title='Token Amount'
        autoComplete='off'
        autoCorrect='off'
        type='text'
        pattern='^[0-9]*[.,]?[0-9]*$'
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
        Balance: 10
      </span>
    </div>
  );
};

export default TokenAmountField;
// ray test touch >>
