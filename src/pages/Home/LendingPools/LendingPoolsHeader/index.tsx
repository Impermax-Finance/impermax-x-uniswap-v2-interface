
import * as React from 'react';
import clsx from 'clsx';

import QuestionHelper from 'components/QuestionHelper';
import { LanguageContext } from 'contexts/LanguageProvider';
import phrases from './translations';

const Heading = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <h6
    className={clsx(
      'truncate',
      className
    )}
    {...rest}>
    {children}
  </h6>
);

const LendingPoolsHeader = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  const languages = React.useContext(LanguageContext);
  const language = languages?.state?.selected;

  if (!language) {
    throw new Error('Invalid language!');
  }

  const t = (s: string) => (phrases[s][language]);

  return (
    <div
      // ray test touch <<
      // TODO: could componentize
      // ray test touch >>
      className={clsx(
        'grid',
        'grid-cols-8',
        'gap-x-4',
        'text-textSecondary',
        'text-sm',
        className
      )}
      {...rest}>
      <Heading className='col-span-3'>
        {t('Market')}
      </Heading>
      <Heading>{t('Total Supply')}</Heading>
      <Heading>{t('Total Borrowed')}</Heading>
      <Heading>{t('Supply APY')}</Heading>
      <Heading>{t('Borrow APY')}</Heading>
      <Heading
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <span>{t('Leveraged LP APY')}</span>
        <QuestionHelper
          placement='left'
          text='Based on last 7 days trading fees assuming a 5x leverage' />
      </Heading>
    </div>
  );
};

export default LendingPoolsHeader;
