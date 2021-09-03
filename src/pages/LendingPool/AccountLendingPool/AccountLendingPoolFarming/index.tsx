import {
  Row,
  Col
} from 'react-bootstrap';

import InteractionButton from 'components/InteractionButton';
import {
  useFarmingShares,
  useAvailableReward,
  useClaimHistory
} from 'hooks/useData';
import {
  PoolTokenType,
  ClaimEvent
} from 'types/interfaces';
import useTrackBorrows from 'hooks/useTrackBorrows';
import useClaims from 'hooks/useClaims';
import { useTransactionUrlGenerator } from 'hooks/useUrlGenerator';
import { formatAmount } from 'utils/format';

interface Props {
  tokenABorrowedInUSD: number;
  tokenBBorrowedInUSD: number;
  collateralSymbol: string;
}

const AccountLendingPoolFarming = ({
  tokenABorrowedInUSD,
  tokenBBorrowedInUSD,
  collateralSymbol
}: Props): JSX.Element => {
  // ray test touch <<
  const farmingSharesA = useFarmingShares(PoolTokenType.BorrowableA);
  const farmingSharesB = useFarmingShares(PoolTokenType.BorrowableB);
  const availableReward = useAvailableReward();
  const claimHistory = useClaimHistory();
  const urlGenerator = useTransactionUrlGenerator();
  // ray test touch >>

  const [trackBorrowsState, onTrackBorrows] = useTrackBorrows();
  const [claimsState, onClaims] = useClaims();

  // if is farming, show to reward accumulated and show a button to claim it
  if (availableReward > 0 || (tokenABorrowedInUSD > 1 && farmingSharesA > 0) && (tokenBBorrowedInUSD > 1 && farmingSharesB > 0)) {
    return (
      <>
        <Row className='account-lending-pool-claim'>
          <Col
            md={12}
            className='col-claim-reward'>
            <InteractionButton
              name={'Claim ' + formatAmount(availableReward) + ' IMX'}
              onCall={onClaims}
              state={claimsState} />
          </Col>
        </Row>
        <div className='claim-history'>
          <b>Claims history</b>
          {claimHistory.map((claimEvent: ClaimEvent, key: any) => {
            return (
              <div key={key}>
                <a
                  href={urlGenerator(claimEvent.transactionHash)}
                  target='_blank'
                  rel='noopener noreferrer'>
                  Claim {formatAmount(claimEvent.amount)} IMX
                </a>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // if doesn't have anything borrowed, tell the user to borrow or leverage
  if (tokenABorrowedInUSD + tokenBBorrowedInUSD < 1) {
    return (
      <div className='account-lending-pool-farming'>
        <div className='info'>Leverage {collateralSymbol} or Borrow to start receiving the IMX reward</div>
      </div>
    );
  }

  // if has borrowed, but it is not tracked, show a button to track the LP
  return (
    <div className='account-lending-pool-farming'>
      <div className='info'>IMX reward on your borrowed position in {collateralSymbol} is not active</div>
      <div className='activate-imx-reward'>
        <InteractionButton
          name='Activate IMX Reward'
          onCall={onTrackBorrows}
          state={trackBorrowsState} />
      </div>
    </div>
  );
};

export default AccountLendingPoolFarming;
