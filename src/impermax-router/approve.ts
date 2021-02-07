import ImpermaxRouter from ".";
import { Address, PoolTokenType, ApprovalType } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";
import { TokenKind } from "graphql";
import { BigNumber, ethers } from "ethers";
import BN from "bn.js";

const MAX_UINT256 = ethers.constants.MaxUint256;

export function getOwnerSpender(this: ImpermaxRouter) : {owner: string, spender: string} {
  return {
    owner: this.account,
    spender: this.router._address,
  }
}

export async function getAllowance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, approvalType: ApprovalType) : Promise<BigNumber> {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  if (token._address == this.WETH && approvalType == ApprovalType.UNDERLYING) return MAX_UINT256;
  const {owner, spender} = this.getOwnerSpender();
  const allowance =
    (approvalType == ApprovalType.POOL_TOKEN) ? await poolToken.methods.allowance(owner, spender).call() :
    (approvalType == ApprovalType.UNDERLYING) ? await token.methods.allowance(owner, spender).call() :
    (approvalType == ApprovalType.BORROW) ? await poolToken.methods.borrowAllowance(owner, spender).call() : 0;
  return BigNumber.from(allowance);
}

export async function approve(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, approvalType: ApprovalType, amount: BigNumber) {
  const {owner, spender} = this.getOwnerSpender();
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  if (approvalType == ApprovalType.POOL_TOKEN) return poolToken.methods.approve(spender, amount).send({from: owner});
  if (approvalType == ApprovalType.UNDERLYING) return token.methods.approve(spender, amount).send({from: owner});
  if (approvalType == ApprovalType.BORROW) return poolToken.methods.borrowaAprove(spender, amount).send({from: owner});
}

export async function getPermitData(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, approvalType: ApprovalType, amount: BigNumber, callBack: Function) {
  const {owner, spender} = this.getOwnerSpender();
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const contract = approvalType == ApprovalType.UNDERLYING ? token : poolToken;
  const nonce = await contract.methods.nonces(spender).call();
  const name = await contract.methods.name().call();

  const data = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name: name,
      version: "1",
      chainId: this.chainId,
      verifyingContract: contract._address,
    },
    primaryType: "Permit",
    message: {
      owner: owner, 
      spender: spender, 
      value: amount.toString(), // è corretto?
      nonce: BigNumber.from(nonce).toHexString(),
      deadline: this.getDeadline().toNumber(),
    }
  });
  
  this.web3.currentProvider.send(
    {
      method: "eth_signTypedData_v4",
      params: [owner, data],
      from: owner
    },
    function(err: any, data: any) {
      if (err) {
        console.error(err);
        callBack(false);
        return;
      }
      const signature = data.result.substring(2);
      const r = "0x" + signature.substring(0, 64);
      const s = "0x" + signature.substring(64, 128);
      const v = parseInt(signature.substring(128, 130), 16);
      // The signature is now comprised of r, s, and v.
      const permitData = ethers.utils.defaultAbiCoder.encode(
				['bool', 'uint8', 'bytes32', 'bytes32'],
				[false, v, r, s]
      );
      callBack(permitData);
    }
  );
}

export async function getApprovalInfo(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, approvalType: ApprovalType) : Promise<object> {
  const {owner, spender} = this.getOwnerSpender();
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const symbol = await this.getSymbol(uniswapV2PairAddress, poolTokenType);
  if (approvalType == ApprovalType.POOL_TOKEN) return {
    summary: `Approve Pool Token ${symbol}`,
    approval: {
      tokenAddress: poolToken.address,
      spender: spender,
    }
  };
  if (approvalType == ApprovalType.UNDERLYING) return {
    summary: `Approve Token ${symbol}`,
    approval: {
      tokenAddress: token.address,
      spender: spender,
    }
  };
  if (approvalType == ApprovalType.BORROW) return {
    summary: `Approve Borrow ${symbol}`,
    approval: {
      tokenAddress: poolToken.address,
      spender: spender,
    }
  };
}