
import clsx from 'clsx';

import ImpermaxCarnationBadge from 'components/badges/ImpermaxCarnationBadge';

interface CustomProps {
  text: string;
}

const TokenAmountLabel = ({
  text,
  className,
  ...rest
}: CustomProps & Omit<React.ComponentPropsWithRef<'label'>, 'children'>): JSX.Element => (
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
    <ImpermaxCarnationBadge>1 xIMX = 1.1666 IMX</ImpermaxCarnationBadge>
  </label>
);

export default TokenAmountLabel;
