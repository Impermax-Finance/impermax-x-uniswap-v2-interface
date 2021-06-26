
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import { PAGES } from 'utils/constants/links';

const CreateNewMarketLinkButton = (): JSX.Element | null => {
  const { active } = useWeb3React<Web3Provider>();

  if (!active) return null;

  return (
    <div
      className={clsx(
        'flex',
        'justify-end'
      )}>
      <Link to={PAGES.CREATE_NEW_PAIR}>
        {/* TODO: should be a link instead of a button */}
        <ImpermaxJadeContainedButton
          style={{
            height: 36
          }}>
          Create New Market
        </ImpermaxJadeContainedButton>
      </Link>
    </div>
  );
};

export default CreateNewMarketLinkButton;
