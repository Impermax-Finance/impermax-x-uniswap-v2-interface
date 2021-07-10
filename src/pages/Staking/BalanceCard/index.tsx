
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
        className
      )}
      {...rest}>
      {/* ray test touch < */}
      <div>
        <h4
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          Balance
        </h4>
        <div>
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
        </div>
      </div>
      {/* ray test touch > */}
    </Panel>
  );
};

export default BalanceCard;
