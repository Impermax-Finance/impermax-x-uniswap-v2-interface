/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { BigNumber } from '@ethersproject/bignumber';
import { defaultAbiCoder } from '@ethersproject/abi';
import { MaxUint256 } from '@ethersproject/constants';

import { PermitData } from '../hooks/useApprove';
import ImpermaxRouter from '.';
import {
  Address,
  PoolTokenType,
  ApprovalType
} from '../types/interfaces';
import { WETH_ADDRESSES } from 'config/web3/contracts/weth';

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
    spender: this.router.address
  };
}

export async function getAllowance(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  approvalType: ApprovalType
) : Promise<BigNumber> {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const wethAddress = WETH_ADDRESSES[this.chainId];
  if (token.address === wethAddress && approvalType === ApprovalType.UNDERLYING) {
    return MaxUint256;
  }

  const {
    owner,
    spender
  } = this.getOwnerSpender();

  // TODO: should use `switch`
  const allowance =
    (approvalType === ApprovalType.POOL_TOKEN) ? await poolToken.allowance(owner, spender) :
      (approvalType === ApprovalType.UNDERLYING) ? await token.allowance(owner, spender) :
        (approvalType === ApprovalType.BORROW) ? await poolToken.borrowAllowance(owner, spender) : 0;

  return BigNumber.from(allowance);
}

export async function approve(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  approvalType: ApprovalType,
  amount: BigNumber,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const { spender } = this.getOwnerSpender();
  const [
    poolToken,
    token
  ] = await this.getContracts(uniswapV2PairAddress, poolTokenType);

  if (approvalType === ApprovalType.POOL_TOKEN) {
    const tx = await poolToken.approve(spender, amount);
    await tx.wait();
  }
  if (approvalType === ApprovalType.UNDERLYING) {
    const tx = await token.approve(spender, amount);
    await tx.wait();
  }
  if (approvalType === ApprovalType.BORROW) {
    const tx = await poolToken.borrowApprove(spender, amount);
    await tx.wait();
  }
  onTransactionHash();
}

export async function getPermitData(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  approvalType: ApprovalType,
  amount: BigNumber,
  deadlineArg: BigNumber | null,
  callBack: (permitData: PermitData) => void
): Promise<void> {
  try {
    if (approvalType === ApprovalType.UNDERLYING && poolTokenType !== PoolTokenType.Collateral) {
      return callBack(null);
    }

    const {
      owner,
      spender
    } = this.getOwnerSpender();
    const [
      poolToken,
      token
    ] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
    const contract = approvalType === ApprovalType.UNDERLYING ? token : poolToken;
    const nonce = await contract.nonces(owner);
    const name = await contract.name();
    const deadline = deadlineArg ? deadlineArg : this.getDeadline();

    const data = {
      types: TYPES,
      domain: {
        name: name,
        version: '1',
        chainId: this.chainId,
        verifyingContract: contract.address
      },
      primaryType: approvalType === ApprovalType.BORROW ? 'BorrowPermit' : 'Permit',
      message: {
        owner: owner,
        spender: spender,
        value: amount.toString(),
        nonce: BigNumber.from(nonce).toHexString(),
        deadline: deadline.toNumber()
      }
    };

    /**
     * MEMO: inspired by:
     * - https://gist.github.com/ajb413/6ca63eb868e179a9c0a3b8dc735733cf
     * - https://www.gitmemory.com/issue/ethers-io/ethers.js/1020/683313086
     */
    const signer = this.library.getSigner(this.account);
    const signature =
      await EIP712.sign(
        data.domain,
        data.primaryType,
        data.message,
        data.types,
        signer
      );
    const permitData: string = defaultAbiCoder.encode(
      [
        'bool',
        'uint8',
        'bytes32',
        'bytes32'
      ],
      [
        false,
        signature.v,
        signature.r,
        signature.s
      ]
    );
    callBack({
      permitData,
      deadline,
      amount
    });
  } catch (error) {
    console.log('[getPermitData] error.message => ', error.message);
    callBack(null);
  }
}
