
import * as React from 'react';
import clsx from 'clsx';

import IconButton from 'components/IconButton';
import List, { ListItem } from 'components/List';
import ImpermaxModal, {
  Props as ImpermaxModalProps,
  ImpermaxModalInnerWrapper,
  ImpermaxModalTitle
} from 'components/UI/ImpermaxModal';
import ImpermaxImage from 'components/UI/ImpermaxImage'; // TODO: should use next/image component (ideally)
import {
  CHAIN_IDS,
  NETWORK_LABELS,
  NETWORK_ICON_PATHS
} from 'config/web3/networks';
import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';

const NetworkConnectModal = ({
  open,
  onClose
}: Props): JSX.Element => {
  const closeIconRef = React.useRef(null);

  return (
    <ImpermaxModal
      initialFocus={closeIconRef}
      open={open}
      onClose={onClose}>
      <ImpermaxModalInnerWrapper
        className={clsx(
          'p-6',
          'max-w-lg'
        )}>
        <ImpermaxModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium'
          )}>
          Select a Network
        </ImpermaxModalTitle>
        <IconButton
          className={clsx(
            'w-12',
            'h-12',
            'absolute',
            'top-3',
            'right-3'
          )}
          onClick={onClose}>
          <CloseIcon
            ref={closeIconRef}
            width={18}
            height={18}
            className='text-textSecondary' />
        </IconButton>
        <List className='mt-4'>
          {[
            CHAIN_IDS.ETHEREUM_MAIN_NET,
            CHAIN_IDS.FANTOM,
            CHAIN_IDS.BSC,
            CHAIN_IDS.MATIC,
            CHAIN_IDS.HECO,
            CHAIN_IDS.XDAI,
            CHAIN_IDS.HARMONY,
            CHAIN_IDS.AVALANCHE,
            CHAIN_IDS.OKEX
          ].map((chainId, index) => {
            return (
              <ListItem key={chainId}>
                <a
                  href='#impermax'
                  className={clsx(
                    index === 0 ? clsx(
                      'text-textPrimary',
                      'bg-gray-100' // TODO: double-check with the design
                    ) : clsx(
                      'text-textSecondary',
                      'hover:text-textPrimary',
                      'hover:bg-gray-50' // TODO: double-check with the design
                    ),
                    'flex',
                    'items-center',
                    'px-3',
                    'py-4',
                    'font-medium',
                    'rounded-md',
                    'space-x-3'
                  )}
                  aria-current={index === 0 ? 'page' : undefined}>
                  <ImpermaxImage
                    className={clsx(
                      'rounded-md',
                      'w-8',
                      'h-8'
                    )}
                    src={NETWORK_ICON_PATHS[chainId]} />
                  <span className='truncate'>
                    {NETWORK_LABELS[chainId]}
                  </span>
                </a>
              </ListItem>
            );
          })}
        </List>
      </ImpermaxModalInnerWrapper>
    </ImpermaxModal>
  );
};

export type Props = Omit<ImpermaxModalProps, 'children'>;

export default NetworkConnectModal;
