
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { LinkIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

// ray test touch <<
import ChainSelect from './ChainSelect';
// ray test touch >>
import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import { PAGES } from 'utils/constants/links';
// ray test touch <<
import { SupportedChain } from 'types/web3/general.d';

interface Props {
  selectedChain: SupportedChain;
  changeSelectedChain: (newValue: SupportedChain) => void;
}
// ray test touch >>

const ActionBar = ({
  selectedChain,
  changeSelectedChain
}: Props): JSX.Element => {
  const { active } = useWeb3React<Web3Provider>();

  return (
    <div
      className={clsx(
        'flex',
        'justify-between',
        'items-center'
      )}>
      {/* ray test touch << */}
      <ChainSelect
        value={selectedChain}
        onChange={changeSelectedChain} />
      {/* ray test touch >> */}
      {active && (
        <Link to={PAGES.CREATE_NEW_PAIR}>
          {/* TODO: should be a link instead of a button */}
          <ImpermaxJadeContainedButton
            style={{ height: 36 }}
            endIcon={
              <LinkIcon
                className={clsx(
                  'w-4',
                  'h-4'
                )} />
            }>
            Create New Market
          </ImpermaxJadeContainedButton>
        </Link>
      )}
    </div>
  );
};

export default ActionBar;
