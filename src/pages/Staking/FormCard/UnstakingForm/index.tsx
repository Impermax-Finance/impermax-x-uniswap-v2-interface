
// ray test touch <<
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  formatUnits,
  parseUnits
} from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { Col, Row } from 'react-bootstrap';

import TokenAmountLabel from '../TokenAmountLabel';
import InteractionButton, { ButtonState } from 'components/InteractionButton';
import InputAmount from 'components/InputAmount';
import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
import useApprove from 'hooks/useApprove';
import useUnstake from 'hooks/useUnstake';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imx';
import { ApprovalType } from 'types/interfaces';

const UnstakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  const {
    chainId,
    library,
    account
  } = useWeb3React<Web3Provider>();

  const [xIMXBalance, setXIMXBalance] = React.useState(0);
  React.useEffect(() => {
    if (!chainId) return;
    if (!library) return;
    if (!account) return;

    (async () => {
      try {
        const xIMXContract = getERC20Contract(X_IMX_ADDRESSES[chainId], library, account);
        const bigXIMXBalance: BigNumber = await xIMXContract.balanceOf(account);
        const floatXIMXBalance = parseFloat(formatUnits(bigXIMXBalance));
        const theXIMXBalance = formatNumberWithFixedDecimals(floatXIMXBalance, 2);
        setXIMXBalance(theXIMXBalance);
      } catch (error) {
        console.log('[UnstakingForm useEffect] error.message => ', error.message);
      }
    })();
  }, [
    chainId,
    library,
    account
  ]);

  const [unstakingAmount, setUnstakingAmount] = React.useState<number>(0);
  const bigUnstakingAmount = parseUnits(unstakingAmount.toString());
  const invalidInput = unstakingAmount > xIMXBalance;

  const [approvalState, onApprove] = useApprove(ApprovalType.UNSTAKE, bigUnstakingAmount, invalidInput);
  const [unstakeState, onUnstake] = useUnstake(approvalState, bigUnstakingAmount, invalidInput);
  return (
    <form {...props}>
      <TokenAmountLabel
        htmlFor='unstaking-amount'
        text='Unstake IMX' />
      {/* <TokenAmountField /> */}
      <InputAmount
        val={unstakingAmount}
        setVal={setUnstakingAmount}
        suffix='xIMX'
        maxTitle='Available'
        max={xIMXBalance} />
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
                name='Unstake'
                onCall={onUnstake}
                state={unstakeState} />
            </Col>
          )
        }
      </Row>
    </form>
  );
};

export default UnstakingForm;
// ray test touch >>
