
import clsx from 'clsx';

import ImpermaxButtonBase, { Props as ImpermaxButtonBaseProps } from 'components/UI/ImpermaxButtonBase';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

type CustomProps = {
  pending?: boolean;
}

const IconButton = ({
  children,
  disabled = false,
  pending = false,
  className,
  ...rest
}: Props): JSX.Element => {
  const disabledOrPending = disabled || pending;

  return (
    <ImpermaxButtonBase
      className={clsx(
        'focus:outline-none',
        'focus:ring',
        'focus:border-primary-300',
        'focus:ring-primary-200',
        'focus:ring-opacity-50',

        'rounded-full',
        'justify-center',
        'hover:bg-black',
        'hover:bg-opacity-5',
        'dark:hover:bg-white',
        'dark:hover:bg-opacity-10',
        className
      )}
      disabled={disabledOrPending}
      {...rest}>
      {pending ? (
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-5',
            'h-5'
          )} />
      ) : children}
    </ImpermaxButtonBase>
  );
};

export type Props = CustomProps & ImpermaxButtonBaseProps;

export default IconButton;
