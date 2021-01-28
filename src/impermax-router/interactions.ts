import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";

export async function deposit(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, val: string|number) {
  const tokenAddress = await this.getTokenAddress(uniswapV2PairAddress, poolTokenType);
  const poolTokenAddress = await this.getTokenAddress(uniswapV2PairAddress, poolTokenType);
  const decimals = await this.getDecimals(uniswapV2PairAddress, poolTokenType);
  const amount = decimalToBalance(val, decimals);
  const deadline = this.getDeadline();
  try {
    if (tokenAddress == this.WETH) await this.router.methods.mintETH(poolTokenAddress, this.account, deadline).send({from: this.account, value: amount});
    else await this.router.methods.mint(poolTokenAddress, amount, this.account, deadline).send({from: this.account});
  } catch (e) {
    console.log(e);
  }
}

export async function borrow(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, val: string|number) {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const tokenAddress = token._address;
  const borrowableAddress = borrowable._address;
  const decimals = await this.getDecimals(uniswapV2PairAddress, poolTokenType);
  const amount = decimalToBalance(val, decimals);
  const deadline = this.getDeadline();
  try {
    if (tokenAddress == this.WETH) {
      await borrowable.methods.borrowApprove(this.router._address, amount).send({from: this.account});
      await this.router.methods.borrowETH(borrowableAddress, amount, this.account, deadline, '0x').call({from: this.account});
      await this.router.methods.borrowETH(borrowableAddress, amount, this.account, deadline, '0x').send({from: this.account});
    } else {
      //await borrowable.methods.borrowApprove(this.router._address, amount).send({from: this.account});
      await this.router.methods.borrow(borrowableAddress, amount, this.account, deadline, '0x').call({from: this.account});
      await this.router.methods.borrow(borrowableAddress, amount, this.account, deadline, '0x').send({from: this.account});
    }
  } catch (e) {
    console.log(e);
  }
}