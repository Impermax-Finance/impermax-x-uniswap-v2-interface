
import clsx from 'clsx';

import ImpermaxTooltip from 'components/UI/ImpermaxTooltip';
import { ReactComponent as OutlineQuestionMarkCircleIcon } from 'assets/images/icons/outline-question-mark-circle.svg';
// ray test touch <<
import './index.scss';
// ray test touch >>

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolDetailsRowProps
 */

const DetailList = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'ul'>): JSX.Element => (
  <ul
    className={clsx(
      'space-y-3',
      className
    )}
    {...rest} />
);

interface DetailListItemCustomProps {
  title: string;
  tooltip?: string;
}

const DetailListItem = ({
  title,
  tooltip,
  children,
  ...rest
}: DetailListItemCustomProps & React.ComponentPropsWithRef<'li'>): JSX.Element => (
  <li {...rest}>
    <div
      className={clsx(
        'flex',
        'items-center',
        'space-x-1'
      )}>
      <span>{title}</span>
      {tooltip && (
        <ImpermaxTooltip label={tooltip}>
          <OutlineQuestionMarkCircleIcon
            width={18}
            height={18} />
        </ImpermaxTooltip>
      )}
    </div>
    <div
      className={clsx(
        'font-bold',
        'flex',
        'items-center',
        'space-x-1'
      )}>
      {children}
    </div>
  </li>
);

// ray test touch <<
interface DetailsRowCustomProps {
  children: any;
}

export function DetailsRowCustom({ children }: DetailsRowCustomProps): JSX.Element {
  return (
    <div className='details-row'>{children}</div>
  );
}
// ray test touch >>

export {
  DetailListItem
};

export default DetailList;
