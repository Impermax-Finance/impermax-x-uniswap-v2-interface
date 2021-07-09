
import clsx from 'clsx';
import Panel from 'components/Panel';

const BalanceCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  return (
    <Panel
      className={clsx(
        className
      )}
      {...rest}>
      BalanceCard
    </Panel>
  );
};

export default BalanceCard;
