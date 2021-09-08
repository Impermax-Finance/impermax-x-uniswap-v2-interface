import clsx from 'clsx';

import Information from './Information';
import APYCard from './APYCard';
import FormCard from './FormCard';
import BalanceCard from './BalanceCard';
import Layout from 'parts/Layout';
// ray test touch <<<
import TVLChart from 'components/charts/TVLChart';
// ray test touch >>>

const MD_WIDTH_72_CLASS = 'md:w-72';

interface ContainerProps {
  children: React.ReactNode;
}

const InternalContainer = ({
  children
}: ContainerProps) => (
  <div
    className={clsx(
      'md:flex',
      'md:justify-center',
      'space-y-6',
      'md:space-y-0',
      'md:space-x-6',
      'w-full'
    )}>
    {children}
  </div>
);

const Staking = (): JSX.Element => (
  <Layout>
    <div
      className={clsx(
        'space-y-6',
        'max-w-6xl',
        'mx-auto',
        'my-4'
      )}>
      {/* ray test touch <<< */}
      <InternalContainer>
        <TVLChart />
      </InternalContainer>
      {/* ray test touch >>> */}
      <InternalContainer>
        <Information
          className={clsx(
            'max-w-xl',
            'flex-grow'
          )} />
        <APYCard
          className={clsx(
            'flex-shrink-0',
            MD_WIDTH_72_CLASS
          )} />
      </InternalContainer>
      <InternalContainer>
        <FormCard
          className={clsx(
            'max-w-xl',
            'flex-grow'
          )} />
        <BalanceCard
          className={clsx(
            'flex-shrink-0',
            MD_WIDTH_72_CLASS
          )} />
      </InternalContainer>
    </div>
  </Layout>
);

export default Staking;
