
import clsx from 'clsx';

import ImpermaxButtonBase, { Props as ImpermaxButtonBaseProps } from 'components/UI/ImpermaxButtonBase';

const ButtonGroup = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      'z-0',
      'inline-flex',
      'shadow-sm',
      'rounded-md',
      'divide-x',
      'divide-gray-300',
      className
    )}
    {...rest} />
);

const JadeButtonGroupItem = ({
  className,
  ...rest
}: ImpermaxButtonBaseProps): JSX.Element => (
  <ImpermaxButtonBase
    type='button'
    className={clsx(
      'px-4',
      'py-2',
      'first:rounded-l-md',
      'last:rounded-r-md',
      'text-white',
      'bg-impermaxJade-600',
      'hover:bg-impermaxJade-700',
      className
    )}
    {...rest} />
);

export {
  JadeButtonGroupItem
};

export default ButtonGroup;
