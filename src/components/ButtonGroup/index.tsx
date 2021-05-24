
import clsx from 'clsx';

import ImpermaxButtonBase, { Props as ImpermaxButtonBaseProps } from 'components/UI/ImpermaxButtonBase';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

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
      className
    )}
    {...rest} />
);

interface CustomJadeButtonGroupItemProps {
  pending?: boolean;
}

const JadeButtonGroupItem = ({
  className,
  children,
  disabled = false,
  pending = false,
  ...rest
}: CustomJadeButtonGroupItemProps & ImpermaxButtonBaseProps): JSX.Element => {
  const disabledOrPending = disabled || pending;

  return (
    <ImpermaxButtonBase
      type='button'
      className={clsx(
        'focus:outline-none',
        'focus:ring-2',
        'focus:border-primary-300',
        'focus:ring-primary-200',
        'focus:ring-opacity-50',

        'border',
        'border-gray-300',
        'font-medium',
        'shadow-sm',
        'text-white',
        'bg-impermaxJade-600',
        'hover:bg-impermaxJade-700',

        'first:rounded-l-md',
        'last:rounded-r-md',
        'px-4',
        'py-2',
        'text-sm',
        '-ml-px',
        className
      )}
      disabled={disabledOrPending}
      {...rest}>
      {pending && (
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-5',
            'h-5',
            'mr-3'
          )} />
      )}
      {children}
    </ImpermaxButtonBase>
  );
};

export {
  JadeButtonGroupItem
};

export default ButtonGroup;
