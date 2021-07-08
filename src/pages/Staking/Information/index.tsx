
import clsx from 'clsx';

const Information = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'space-y-3',
      className
    )}
    {...rest}>
    <h2
      className={clsx(
        'text-textPrimary',
        'font-medium',
        'text-lg'
      )}>
      Maximize yield by staking IMX for xIMX
    </h2>
    <p
      className={clsx(
        'text-textSecondary',
        'text-base',
        'text-justify'
      )}>
      {`
        For every swap on the exchange on every chain,
        0.05% of the swap fees are distributed as SUSHI proportional to your share of the SushiBar.
         When your SUSHI is staked into the SushiBar,
         you receive xSUSHI in return for voting rights and
         a fully composable token that can interact with other protocols.
         Your xSUSHI is continuously compounding,
         when you unstake you will receive all the originally deposited SUSHI and any additional from fees.
      `}
    </p>
  </div>
);

export default Information;
