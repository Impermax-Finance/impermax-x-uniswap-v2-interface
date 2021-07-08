
import TokenAmountLabel from '../TokenAmountLabel';
import TokenAmountField from '../TokenAmountField';

const StakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  return (
    <form {...props}>
      <TokenAmountLabel
        htmlFor='staking-amount'
        text='Stake IMX' />
      <TokenAmountField
        id='staking-amount'
        name='staking-amount' />
    </form>
  );
};

export default StakingForm;
