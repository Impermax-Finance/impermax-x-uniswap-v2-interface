
import TokenAmountLabel from '../TokenAmountLabel';
import TokenAmountField from '../TokenAmountField';

const UnstakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  return (
    <form {...props}>
      <TokenAmountLabel
        htmlFor='unstaking-amount'
        text='Unstake IMX' />
      <TokenAmountField
        id='unstaking-amount'
        name='unstaking-amount' />
    </form>
  );
};

export default UnstakingForm;
