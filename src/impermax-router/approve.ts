/* eslint-disable no-invalid-this */
// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import ImpermaxRouter from '.';
import { Address, PoolTokenType, ApprovalType } from './interfaces';
import { BigNumber, ethers } from 'ethers';
import { PermitData } from '../hooks/useApprove';

const MAX_UINT256 = ethers.constants.MaxUint256;

const EIP712DOMAIN = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];
const PERMIT = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' }
];
const TYPES = {
  EIP712Domain: EIP712DOMAIN,
  Permit: PERMIT,
  BorrowPermit: PERMIT
};

export function getOwnerSpender(this: ImpermaxRouter) : {owner: string, spender: string} {
  return {
    owner: this.account,
    spender: this.router._address
  };
}

export async function getAllowance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, approvalType: ApprovalType) : Promise<BigNumber> {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  // eslint-disable-next-line eqeqeq
  if (token._address == this.WETH && approvalType == ApprovalType.UNDERLYING) return MAX_UINT256;
  const { owner, spender } = this.getOwnerSpender();
  const allowance =
    // eslint-disable-next-line eqeqeq
    (approvalType == ApprovalType.POOL_TOKEN) ? await poolToken.methods.allowance(owner, spender).call() :
      // eslint-disable-next-line eqeqeq
      (approvalType == ApprovalType.UNDERLYING) ? await token.methods.allowance(owner, spender).call() :
        // eslint-disable-next-line eqeqeq
        (approvalType == ApprovalType.BORROW) ? await poolToken.methods.borrowAllowance(owner, spender).call() : 0;
  return BigNumber.from(allowance);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function approve(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, approvalType: ApprovalType, amount: BigNumber, onTransactionHash: Function) {
  const { owner, spender } = this.getOwnerSpender();
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  let send;
  // eslint-disable-next-line eqeqeq
  if (approvalType == ApprovalType.POOL_TOKEN) send = poolToken.methods.approve(spender, amount).send({ from: owner });
  // eslint-disable-next-line eqeqeq
  if (approvalType == ApprovalType.UNDERLYING) send = token.methods.approve(spender, amount).send({ from: owner });
  // eslint-disable-next-line eqeqeq
  if (approvalType == ApprovalType.BORROW) send = poolToken.methods.borrowApprove(spender, amount).send({ from: owner });
  return send.on('transactionHash', onTransactionHash);
}

export async function getPermitData(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  approvalType: ApprovalType,
  amount: BigNumber,
  deadlineArg: BigNumber | null,
  callBack: (permitData: PermitData) => void
) {
  // eslint-disable-next-line eqeqeq
  if (approvalType === ApprovalType.UNDERLYING && poolTokenType != PoolTokenType.Collateral) return callBack(null);
  const { owner, spender } = this.getOwnerSpender();
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  // eslint-disable-next-line eqeqeq
  const contract = approvalType == ApprovalType.UNDERLYING ? token : poolToken;
  const nonce = await contract.methods.nonces(owner).call();
  const name = await contract.methods.name().call();
  const deadline = deadlineArg ? deadlineArg : this.getDeadline();

  const data = JSON.stringify({
    types: TYPES,
    domain: {
      name: name,
      version: '1',
      chainId: this.chainId,
      verifyingContract: contract._address
    },
    // eslint-disable-next-line eqeqeq
    primaryType: approvalType == ApprovalType.BORROW ? 'BorrowPermit' : 'Permit',
    message: {
      owner: owner,
      spender: spender,
      value: amount.toString(),
      nonce: BigNumber.from(nonce).toHexString(),
      deadline: deadline.toNumber()
    }
  });

  this.web3.currentProvider.send(
    {
      method: 'eth_signTypedData_v4',
      params: [owner, data],
      from: owner
    },
    (err: any, data: any) => {
      if (err) {
        console.error(err);
        return callBack(null);
      }
      const signature = data.result.substring(2);
      const r = '0x' + signature.substring(0, 64);
      const s = '0x' + signature.substring(64, 128);
      const v = parseInt(signature.substring(128, 130), 16);
      const permitData: string = ethers.utils.defaultAbiCoder.encode(
        ['bool', 'uint8', 'bytes32', 'bytes32'],
        [false, v, r, s]
      );
      callBack({ permitData, deadline, amount });
    }
  );
}
