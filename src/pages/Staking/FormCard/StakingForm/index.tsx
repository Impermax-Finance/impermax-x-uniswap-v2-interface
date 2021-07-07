
import clsx from 'clsx';

import ImpermaxInput from 'components/UI/ImpermaxInput';
import ImpermaxCarnationBadge from 'components/badges/ImpermaxCarnationBadge';

const StakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  return (
    <form {...props}>
      {/* TODO: could componentize */}
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
          Stake IMX
        </span>
        <ImpermaxCarnationBadge>1 xIMX = 1.1666 IMX</ImpermaxCarnationBadge>
      </div>
      <ImpermaxInput
        className={clsx(
          'h-14',
          'shadow-inner'
        )} />
    </form>
  );
};

export default StakingForm;
