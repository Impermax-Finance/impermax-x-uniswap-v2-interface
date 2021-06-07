
import * as React from 'react';
import clsx from 'clsx';

import IconButton from 'components/IconButton';
import ImpermaxModal, {
  Props as ImpermaxModalProps,
  ImpermaxModalInnerWrapper,
  ImpermaxModalTitle
} from 'components/UI/ImpermaxModal';
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
        {/* ray test touch < */}
        Hi
        {/* ray test touch > */}
      </ImpermaxModalInnerWrapper>
    </ImpermaxModal>
  );
};

export type Props = Omit<ImpermaxModalProps, 'children'>;

export default NetworkConnectModal;
