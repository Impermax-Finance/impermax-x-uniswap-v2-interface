
import clsx from 'clsx';

import Panel from 'components/Panel';
import ImpermaxPicture from 'components/UI/ImpermaxPicture';

const BalanceCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  return (
    <Panel
      className={clsx(
        'px-8',
        'py-7',
        'space-y-8',
        'bg-white',
        className
      )}
      {...rest}>
      <div className='space-y-3'>
        <h4
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          Staked Balance
        </h4>
        <div
          className={clsx(
            'flex',
            'items-center',
            'space-x-4'
          )}>
          <ImpermaxPicture
            images={[
              {
                type: 'image/avif',
                path: 'assets/images/imx-logos/imx-logo.avif'
              },
              {
                type: 'image/webp',
                path: 'assets/images/imx-logos/imx-logo.webp'
              },
              {
                type: 'image/png',
                path: 'assets/images/imx-logos/imx-logo.png'
              }
            ]}
            width={64}
            height={64}
            alt='IMX' />
          <div
            className={clsx(
              'inline-flex',
              'flex-col',
              'space-y-1'
            )}>
            <span className='font-medium'>_</span>
            <span>xIMX</span>
          </div>
        </div>
      </div>
      <div className='space-y-3'>
        <h4
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          Unstaked Balance
        </h4>
        <div
          className={clsx(
            'flex',
            'items-center',
            'space-x-4'
          )}>
          <ImpermaxPicture
            images={[
              {
                type: 'image/avif',
                path: 'assets/images/ximx-logos/ximx-logo.avif'
              },
              {
                type: 'image/webp',
                path: 'assets/images/ximx-logos/ximx-logo.webp'
              },
              {
                type: 'image/png',
                path: 'assets/images/ximx-logos/ximx-logo.png'
              }
            ]}
            width={64}
            height={64}
            alt='xIMX' />
          <div
            className={clsx(
              'inline-flex',
              'flex-col',
              'space-y-1'
            )}>
            <span className='font-medium'>_</span>
            <span>IMX</span>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default BalanceCard;
