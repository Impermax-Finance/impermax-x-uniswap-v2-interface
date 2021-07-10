
import clsx from 'clsx';

import ImpermaxPicture from 'components/UI/ImpermaxPicture';

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
    <ImpermaxPicture
      width={150}
      height={157}
      images={[
        {
          type: 'image/avif',
          path: 'assets/images/impermax-logos/logo-text-square-all-green.avif'
        },
        {
          type: 'image/webp',
          path: 'assets/images/impermax-logos/logo-text-square-all-green.webp'
        },
        {
          type: 'image/png',
          path: 'assets/images/impermax-logos/logo-text-square-all-green.png'
        }
      ]}
      alt='Impermax Logo' />
  </div>
);

export default Logo;
