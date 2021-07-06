
import * as React from 'react';
import clsx from 'clsx';

import UpperPart from './UpperPart';
import LowerPart from './LowerPart';

type Ref = HTMLDivElement;
type Props = React.ComponentPropsWithRef<'footer'>;

const Footer = React.forwardRef<Ref, Props>(({
  className,
  ...rest
}, ref): JSX.Element => (
  <footer
    ref={ref}
    className={clsx(
      'border-t',
      'bg-IMPERMAXAlabaster',
      className
    )}
    aria-labelledby='footerHeading'
    {...rest}>
    <h2
      id='footerHeading'
      className='sr-only'>
      Footer
    </h2>
    <div
      className={clsx(
        'container',
        'mx-auto',
        'py-12',
        'px-4',
        'sm:px-6',
        'lg:py-16',
        'lg:px-8',
        'space-y-8'
      )}>
      <UpperPart />
      <LowerPart />
    </div>
  </footer>
));
Footer.displayName = 'Footer';

export default Footer;
