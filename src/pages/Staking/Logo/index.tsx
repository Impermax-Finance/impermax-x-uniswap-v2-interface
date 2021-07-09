
import clsx from 'clsx';

import ImpermaxImage from 'components/UI/ImpermaxImage';

const Logo = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'grid',
      'place-items-center',
      'py-6',
      className
    )}
    {...rest}>
    <ImpermaxImage
      style={{
        width: 150,
        height: 157
      }}
      // TODO: should optimize
      src='assets/images/logos/logo-text-square-all-green.avif'
      alt='Logo' />
  </div>
);

export default Logo;
