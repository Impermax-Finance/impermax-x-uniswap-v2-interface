import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";

export async function deposit(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, val: string|number) {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const decimals = (poolTokenType == PoolTokenType.Collateral) ? 18 :
    (await this.getBorrowableBaseInfo(uniswapV2PairAddress, poolTokenType)).decimals;
  const amount = decimalToBalance(val, decimals);
  const deadline = this.getDeadline();
  try {
    if (token._address == this.WETH) {
      const result = await this.router.methods.mintETH(poolToken._address, this.account, deadline).call({from: this.account, value: amount});
      await this.router.methods.mintETH(poolToken._address, this.account, deadline).send({from: this.account, value: amount});
    } else {
      const result = await this.router.methods.mint(poolToken._address, amount, this.account, deadline).call({from: this.account});
      await this.router.methods.mint(poolToken._address, amount, this.account, deadline).send({from: this.account, value: 0});
    }
  } catch (e) {
    console.log(e);
  }
}