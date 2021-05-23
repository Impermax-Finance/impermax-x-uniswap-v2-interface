
import clsx from 'clsx';

import ImpermaxButtonBase from 'components/UI/ImpermaxButtonBase';

const ContainedButton = (): JSX.Element => (
  <ImpermaxButtonBase
    type='button'
    className={clsx(
      'px-4',
      'py-2',
      'border',
      'border-transparent',
      'text-sm',
      'font-medium',
      'rounded-md',
      'shadow-sm',
      'text-white',
      'bg-impermaxJade-600',
      'hover:bg-impermaxJade-700'
    )}>
    ContainedButton
  </ImpermaxButtonBase>
);

export default ContainedButton;
