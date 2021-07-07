
import clsx from 'clsx';

import ImpermaxInput from 'components/UI/ImpermaxInput';

const StakingForm = (): JSX.Element => {
  return (
    <form>
      <ImpermaxInput
        className={clsx(
          'h-14',
          'shadow-inner'
        )} />
    </form>
  );
};

export default StakingForm;
