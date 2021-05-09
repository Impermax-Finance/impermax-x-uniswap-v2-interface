// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { Button } from 'react-bootstrap';
import { useAirdropData } from '../../hooks/useData';
import { formatAmount } from '../../utils/format';
import { ButtonState } from '../InteractionButton';
import useClaimAirdrop from '../../hooks/useClaimAirdrop';

/**
 * Sets up a component for the application's wallet section, when the wallet is connected.
 */

export function ClaimAirdrop(): JSX.Element {
  const airdropData = useAirdropData();
  const [claimAirdropState, claimAirdrop] = useClaimAirdrop();

  if (!airdropData || !airdropData.amount) return (null);

  return (
    <>
      <Button
        className='claim-button'
        // eslint-disable-next-line eqeqeq
        onClick={claimAirdropState == ButtonState.Ready ? claimAirdrop : null}>
        Claim {formatAmount(parseFloat(airdropData.amount.toString()) / 1e18)} IMX
      </Button>
    </>
  );
}
