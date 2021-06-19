// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import clsx from 'clsx';

import { LanguageContext } from 'contexts/LanguageProvider';
import PairAddressContext from 'contexts/PairAddress';
import LendingPoolsRow from './LendingPoolsRow';
import QuestionHelper from 'components/QuestionHelper';
import { usePairList } from 'hooks/useData';
import phrases from './translations';
import './index.scss';

const LendingPoolsTable = (): JSX.Element => {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const pairList = usePairList();
  const t = (s: string) => (phrases[s][language]);

  if (!pairList) {
    return (
      <div className='spinner-container'>
        <Spinner
          animation='border'
          size='lg' />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'lending-pools-table',
        // ray test touch <<
        'space-y-3'
        // ray test touch >>
      )}>
      <div className='lending-pools-header row'>
        <div className='col-7 col-md-5 col-lg-4'>{t('Market')}</div>
        <div className='col d-none d-md-block'>{t('Total Supply')}</div>
        <div className='col d-none d-md-block'>{t('Total Borrowed')}</div>
        <div className='col d-none d-lg-block'>{t('Supply APY')}</div>
        <div className='col d-none d-lg-block'>{t('Borrow APY')}</div>
        <div className='col-5 col-md-3 col-lg-2 text-center'>
          {t('Leveraged LP APY')}
          <QuestionHelper
            placement='left'
            text='Based on last 7 days trading fees assuming a 5x leverage' />
        </div>
      </div>
      {pairList.map((pair: string, key: any) => {
        return (
          <PairAddressContext.Provider
            value={pair}
            key={key}>
            <LendingPoolsRow />
          </PairAddressContext.Provider>
        );
      })}
    </div>
  );
};

export default LendingPoolsTable;
