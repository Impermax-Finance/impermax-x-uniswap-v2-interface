// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { ButtonState } from 'components/InteractionButton';
import { Button } from 'react-bootstrap';
import { useAirdropData } from 'hooks/useData';
import { formatAmount } from 'utils/format';
import useClaimAirdrop from 'hooks/useClaimAirdrop';

const ClaimAirdrop = (): JSX.Element => {
  const airdropData = useAirdropData();
  const [claimAirdropState, claimAirdrop] = useClaimAirdrop();

  if (!airdropData || !airdropData.amount) return null;

  return (
    <Button
      className='claim-button'
      onClick={claimAirdropState === ButtonState.Ready ? claimAirdrop : null}>
      Claim {formatAmount(parseFloat(airdropData.amount.toString()) / 1e18)} IMX
    </Button>
  );
};

export default ClaimAirdrop;
