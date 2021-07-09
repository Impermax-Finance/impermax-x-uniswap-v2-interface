
import clsx from 'clsx';

const BalanceCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  return (
    <div
      className={clsx(
        className
      )}
      {...rest}>
      BalanceCard
    </div>
  );
};

export default BalanceCard;
