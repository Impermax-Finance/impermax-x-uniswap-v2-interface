
import clsx from 'clsx';

import ImpermaxInput from 'components/UI/ImpermaxInput';

const FormCard = (): JSX.Element => {
  return (
    <div
      className={clsx(
        'px-6',
        'py-4',
        'rounded-lg',
        'bg-impermaxBlackHaze-600'
      )}>
      <ImpermaxInput
        className={clsx(
          'h-14',
          'shadow-inner'
        )} />
    </div>
  );
};

export default FormCard;
