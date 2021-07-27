import clsx from 'clsx';

import Layout from 'parts/Layout';
import Information from './Information';
import APYCard from './APYCard';
import FormCard from './FormCard';
import BalanceCard from './BalanceCard';

const MD_WIDTH_72_CLASS = 'md:w-72';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({
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
      <Container>
        <Information
          className={clsx(
            'max-w-xl',
            'flex-grow'
          )} />
        <APYCard
          className={clsx(
            // ray test touch <<<
            'flex-shrink-0',
            // 'lg:grid',
            // ray test touch >>>
            MD_WIDTH_72_CLASS
          )} />
      </Container>
      <Container>
        <FormCard
          className={clsx(
            'max-w-xl',
            'flex-grow'
          )} />
        <BalanceCard className={MD_WIDTH_72_CLASS} />
      </Container>
    </div>
  </Layout>
);

export default Staking;
