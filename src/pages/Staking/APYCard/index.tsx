
// ray test touch <<
import clsx from 'clsx';
import { useXIMXAPY } from '../../../hooks/useData';
import { formatPercentage } from '../../../utils/format';

const APYCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  const stakingAPY = useXIMXAPY();
  return (
    <div
      className={clsx(
        'px-6',
        'py-4',
        'flex',
        'justify-between',
        'items-center',
        'rounded-lg',
        'bg-impermaxJade-200',
        className
      )}
      {...rest}>
      <div
        className={clsx(
          'text-base',
          'font-medium'
        )}>
        Staking APY
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
          {formatPercentage(stakingAPY)}
        </span>
        <span
          className={clsx(
            'text-sm',
            'text-textSecondary',
            'font-medium'
          )}>
          Staking APY
        </span>
      </div>
    </div>
  );
};

export default APYCard;
// ray test touch >>
