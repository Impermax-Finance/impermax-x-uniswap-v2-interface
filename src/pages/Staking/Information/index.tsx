
import clsx from 'clsx';

import ImpermaxLink from 'components/UI/ImpermaxLink';

const Information = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      className
    )}
    {...rest}>
    <h2
      className={clsx(
        'text-textPrimary',
        'font-medium',
        'text-lg'
      )}>
      What is IBEX Staking?
    </h2>
    <p
      className={clsx(
        'text-textSecondary',
        'text-base',
        'text-justify'
      )}>
      {`
        IBEX staking is the mechanism used to distribute Impermax's protocol profits to IBEX token holders.
      `}
    </p>
    <h2
      className={clsx(
        'text-textPrimary',
        'font-medium',
        'text-lg',
        'mt-4'
      )}>
      Stake IBEX, Earn IBEX
    </h2>
    <p
      className={clsx(
        'text-textSecondary',
        'text-base',
        'text-justify'
      )}>
      {`
        A part of protocol profits is used to buyback IBEX from the market and distribute it to stakers of this vault. All tokens distributed are auto-compounded. By staking IBEX you receive an xIBEX token that you can unstake at any moment.
      `}
      <ImpermaxLink
        href='https://docs.impermax.finance/tokenomics/ibex-staking'
        className={clsx(
          'underline',
          'cursor-pointer',
          'text-impermaxJade'
        )}
        target='_blank'
        rel='noopener noreferrer'>
        Learn more
      </ImpermaxLink>
    </p>
    {/*
    <h2
      className={clsx(
        'text-textPrimary',
        'font-medium',
        'text-lg',
        'mt-4'
      )}>
      Stake IMX, Earn USDC
    </h2>
    <p
      className={clsx(
        'text-textSecondary',
        'text-base',
        'text-justify'
      )}>
      {`
        The remaining part of protocol profits is used to buy USDC and distribute it to stakers of the second vault. You can unstake your IMX and claim your USDC pending reward at any time.
      `}
    </p>
    */}
  </div>
);

export default Information;
