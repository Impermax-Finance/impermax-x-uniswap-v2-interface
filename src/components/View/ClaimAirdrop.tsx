import React, { useState, useMemo } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useAirdropData } from '../../hooks/useData';
import { formatAmount } from '../../utils/format';
import { ButtonState } from '../InteractionButton';
import useClaimAirdrop from '../../hooks/useClaimAirdrop';

/**
 * Sets up a component for the application's wallet section, when the wallet is connected.
 */
export function ClaimAirdrop() {
  const airdropData = useAirdropData();
  const [claimAirdropState, claimAirdrop] = useClaimAirdrop();

  if (!airdropData || !airdropData.amount) return (null);

  return (<>
    <Button className="claim-button" onClick={claimAirdropState == ButtonState.Ready ? claimAirdrop : null}>
      Claim { formatAmount(parseFloat(airdropData.amount.toString()) / 1e18) } IMX
    </Button>
  </>);
}