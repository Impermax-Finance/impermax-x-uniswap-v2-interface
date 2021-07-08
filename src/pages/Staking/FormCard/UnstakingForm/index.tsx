
import TokenAmountLabel from '../TokenAmountLabel';
import TokenAmountField from '../TokenAmountField';
import SubmitButton from '../SubmitButton';

const UnstakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  return (
    <form {...props}>
      <TokenAmountLabel
        htmlFor='unstaking-amount'
        text='Unstake IMX' />
      <TokenAmountField
        id='unstaking-amount'
        name='unstaking-amount' />
      <SubmitButton>Unstake</SubmitButton>
    </form>
  );
};

export default UnstakingForm;
