
// ray test touch <<
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { Col, Row } from 'react-bootstrap';

import TokenAmountLabel from '../TokenAmountLabel';
import InteractionButton, { ButtonState } from 'components/InteractionButton';
import InputAmount from 'components/InputAmount';
import useERC20Contract from 'utils/hooks/web3/use-erc20-contract';
import { useToBigNumber } from 'hooks/useData';
import useStake from 'hooks/useStake';
import useApprove from 'hooks/useApprove';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import { IMX_ADDRESSES } from 'config/web3/contracts/imx';
import { ApprovalType } from 'types/interfaces';

const StakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  const {
    chainId,
    account
  } = useWeb3React<Web3Provider>();

  const imxContract = useERC20Contract(chainId ? IMX_ADDRESSES[chainId] : undefined);
  const [imxBalance, setIMXBalance] = React.useState(0);
  React.useEffect(() => {
    if (!imxContract) return;
    if (!account) return;

    (async () => {
      try {
        const bigIMXBalance: BigNumber = await imxContract.balanceOf(account);
        const floatIMXBalance = parseFloat(formatUnits(bigIMXBalance));
        const theIMXBalance = formatNumberWithFixedDecimals(floatIMXBalance, 2);
        setIMXBalance(theIMXBalance);
      } catch (error) {
        console.log('[StakingForm useEffect] error.message => ', error.message);
      }
    })();
  }, [
    imxContract,
    account
  ]);

  const [val, setVal] = React.useState<number>(0);
  const amount = useToBigNumber(val, undefined, 18);
  const invalidInput = val > imxBalance;

  const [approvalState, onApprove] = useApprove(ApprovalType.STAKE, amount, invalidInput);
  const [stakeState, onStake] = useStake(approvalState, amount, invalidInput);
  return (
    <form {...props}>
      <TokenAmountLabel
        htmlFor='staking-amount'
        text='Stake IMX' />
      {/* <TokenAmountField /> */}
      <InputAmount
        val={val}
        setVal={setVal}
        suffix='IMX'
        maxTitle='Available'
        max={imxBalance} />
      <Row className='interaction-row'>
        {/* eslint-disable-next-line no-negated-condition */}
        {approvalState !== ButtonState.Done ?
          (
            <Col xs={12}>
              <InteractionButton
                name='Approve'
                onCall={onApprove}
                state={approvalState} />
            </Col>
          ) : (
            <Col xs={12}>
              <InteractionButton
                name='Stake'
                onCall={onStake}
                state={stakeState} />
            </Col>
          )
        }
      </Row>
    </form>
  );
};

export default StakingForm;
// ray test touch >>
