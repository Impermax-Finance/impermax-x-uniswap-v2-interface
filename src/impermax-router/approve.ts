/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { BigNumber } from '@ethersproject/bignumber';
// ray test touch <<
import { defaultAbiCoder } from '@ethersproject/abi';
import { MaxUint256 } from '@ethersproject/constants';
// import * as EIP712 from 'utils/helpers/web3/EIP712';
// ray test touch >>
import { PermitData } from '../hooks/useApprove';
import ImpermaxRouter from '.';
import {
  Address,
  PoolTokenType,
  ApprovalType
} from './interfaces';

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

// ray test touch <<
export async function getAllowance(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  approvalType: ApprovalType
) : Promise<BigNumber> {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  if (token.address === this.WETH && approvalType === ApprovalType.UNDERLYING) {
  // if (token._address === this.WETH && approvalType === ApprovalType.UNDERLYING) {
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
  // const allowance =
  //   (approvalType === ApprovalType.POOL_TOKEN) ? await poolToken.methods.allowance(owner, spender).call() :
  //     (approvalType === ApprovalType.UNDERLYING) ? await token.methods.allowance(owner, spender).call() :
  //       (approvalType === ApprovalType.BORROW) ? await poolToken.methods.borrowAllowance(owner, spender).call() : 0;

  return BigNumber.from(allowance);
}
// ray test touch >>

// ray test touch <<
export async function approve(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  approvalType: ApprovalType,
  amount: BigNumber,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const {
    // ray test touch <<
    // owner,
    // ray test touch >>
    spender
  } = this.getOwnerSpender();
  const [
    poolToken,
    token
  ] = await this.getContracts(uniswapV2PairAddress, poolTokenType);

  if (approvalType === ApprovalType.POOL_TOKEN) {
    const tx = await poolToken.approve(spender, amount);
    await tx.wait();
    // send = poolToken.methods.approve(spender, amount).send({ from: owner });
  }
  if (approvalType === ApprovalType.UNDERLYING) {
    const tx = await token.approve(spender, amount);
    await tx.wait();
    // send = token.methods.approve(spender, amount).send({ from: owner });
  }
  if (approvalType === ApprovalType.BORROW) {
    const tx = await poolToken.borrowApprove(spender, amount);
    await tx.wait();
    // send = poolToken.methods.borrowApprove(spender, amount).send({ from: owner });
  }
  onTransactionHash();
  // let send;
  // return send.on('transactionHash', onTransactionHash);
}
// ray test touch >>

export async function getPermitData(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  approvalType: ApprovalType,
  amount: BigNumber,
  deadlineArg: BigNumber | null,
  callBack: (permitData: PermitData) => void
): Promise<void> {
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
  // ray test touch <<
  const nonce = await contract.nonces(owner);
  const name = await contract.name();
  // const nonce = await contract.methods.nonces(owner).call();
  // const name = await contract.methods.name().call();
  // ray test touch >>
  const deadline = deadlineArg ? deadlineArg : this.getDeadline();

  // ray test touch <<
  const data = {
    types: TYPES,
    domain: {
      name: name,
      version: '1',
      chainId: this.chainId,
      // ray test touch <<
      verifyingContract: contract.address
      // verifyingContract: contract._address
      // ray test touch >>
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
  try {
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
  // const data = JSON.stringify({
  //   types: TYPES,
  //   domain: {
  //     name: name,
  //     version: '1',
  //     chainId: this.chainId,
  //     // ray test touch <<
  //     verifyingContract: contract.address
  //     // verifyingContract: contract._address
  //     // ray test touch >>
  //   },
  //   primaryType: approvalType === ApprovalType.BORROW ? 'BorrowPermit' : 'Permit',
  //   message: {
  //     owner: owner,
  //     spender: spender,
  //     value: amount.toString(),
  //     nonce: BigNumber.from(nonce).toHexString(),
  //     deadline: deadline.toNumber()
  //   }
  // });
  // this.web3.currentProvider.send(
  //   {
  //     method: 'eth_signTypedData_v4',
  //     params: [owner, data],
  //     from: owner
  //   },
  //   (error: any, data: any) => {
  //     if (error) {
  //       console.error(error);
  //       return callBack(null);
  //     }
  //     const signature = data.result.substring(2);
  //     const r = '0x' + signature.substring(0, 64);
  //     const s = '0x' + signature.substring(64, 128);
  //     const v = parseInt(signature.substring(128, 130), 16);
  //     const permitData: string = defaultAbiCoder.encode(
  //       ['bool', 'uint8', 'bytes32', 'bytes32'],
  //       [false, v, r, s]
  //     );
  //     callBack({
  //       permitData,
  //       deadline,
  //       amount
  //     });
  //   }
  // );
  // ray test touch >>
}
