
import clsx from 'clsx';

import Panel from 'components/Panel';

const APRCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  return (
    <Panel
      className={clsx(
        'px-6',
        'py-4',
        'flex',
        'justify-between',
        'items-center',
        'bg-impermaxJade-200',
        className
      )}
      {...rest}>
      <div
        className={clsx(
          'text-base',
          'font-medium'
        )}>
        Staking APR
      </div>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'items-end',
          'space-y-1'
        )}>
        <span
          className={clsx(
            'font-bold',
            'text-2xl',
            'text-textPrimary'
          )}>
          7.52%
        </span>
        <span
          className={clsx(
            'text-sm',
            'text-textSecondary',
            'font-medium'
          )}>
          Yesterday&apos;s APR
        </span>
      </div>
    </Panel>
  );
};

export default APRCard;
