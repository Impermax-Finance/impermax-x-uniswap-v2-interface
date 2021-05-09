import { Row, Col } from 'react-bootstrap';
import { formatAmount } from '../../utils/format';
import { useSymbol, useBorrowedUSD, useFarmingShares, useAvailableReward, useClaimHistory } from '../../hooks/useData';
import { PoolTokenType, ClaimEvent } from '../../impermax-router/interfaces';
import useTrackBorrows from '../../hooks/useTrackBorrows';
import InteractionButton from '../InteractionButton';
import useClaims from '../../hooks/useClaims';
import { useTransactionUrlGenerator } from '../../hooks/useUrlGenerator';

export default function AccountLendingPoolFarming(): JSX.Element {
  const symbol = useSymbol(PoolTokenType.Collateral);
  // ray test touch <
  // const imxPrice = useImxPrice();
  // ray test touch >
  const borrowedA = useBorrowedUSD(PoolTokenType.BorrowableA);
  const borrowedB = useBorrowedUSD(PoolTokenType.BorrowableB);
  // ray test touch <
  // const totalBorrowedA = useTotalBorrowsUSD(PoolTokenType.BorrowableA);
  // const totalBorrowedB = useTotalBorrowsUSD(PoolTokenType.BorrowableB);
  // const rewardSpeedA = useRewardSpeed(PoolTokenType.BorrowableA);
  // const rewardSpeedB = useRewardSpeed(PoolTokenType.BorrowableB);
  // ray test touch >
  const farmingSharesA = useFarmingShares(PoolTokenType.BorrowableA);
  const farmingSharesB = useFarmingShares(PoolTokenType.BorrowableB);
  const availableReward = useAvailableReward();
  const claimHistory = useClaimHistory();
  const urlGenerator = useTransactionUrlGenerator();
  // ray test touch <
  // const userRewardPerMonth = (rewardSpeedA * borrowedA / totalBorrowedA + rewardSpeedB * borrowedB / totalBorrowedB) * 24 * 3600 * 30;
  // ray test touch >

  const [trackBorrowsState, onTrackBorrows] = useTrackBorrows();
  const [claimsState, onClaims] = useClaims();

  // if is farming, show to reward accumulated and show a button to claim it
  if (availableReward > 0 || (borrowedA > 1 && farmingSharesA > 0) && (borrowedB > 1 && farmingSharesB > 0)) {
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
                  target='_blank'>Claim {formatAmount(claimEvent.amount)} IMX
                </a>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // if doesn't have anything borrowed, tell the user to borrow or leverage
  if (borrowedA + borrowedB < 1) {
    return (
      <div className='account-lending-pool-farming'>
        <div className='info'>Leverage {symbol} or Borrow to start receiving the IMX reward</div>
      </div>
    );
  }

  // if has borrowed, but it is not tracked, show a button to track the LP
  return (
    <div className='account-lending-pool-farming'>
      <div className='info'>IMX reward on your borrowed position in {symbol} is not active</div>
      <div className='activate-imx-reward'>
        <InteractionButton
          name='Activate IMX Reward'
          onCall={onTrackBorrows}
          state={trackBorrowsState} />
      </div>
    </div>
  );
}
