
import clsx from 'clsx';

import ImpermaxCarnationBadge from 'components/badges/ImpermaxCarnationBadge';
import TokenAmountField from '../TokenAmountField';

const UnstakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  return (
    <form {...props}>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        <span
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          Unstake IMX
        </span>
        <ImpermaxCarnationBadge>1 xIMX = 1.1666 IMX</ImpermaxCarnationBadge>
      </div>
      <TokenAmountField />
    </form>
  );
};

export default UnstakingForm;
