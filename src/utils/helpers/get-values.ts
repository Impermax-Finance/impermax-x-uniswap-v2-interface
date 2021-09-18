
import { Changes } from 'types/interfaces';

const getValues = (
  collateralDeposited: number,
  tokenADenomLPPrice: number,
  tokenBDenomLPPrice: number,
  tokenABorrowed: number,
  tokenBBorrowed: number,
  changes: Changes = {
    changeCollateral: 0,
    changeBorrowedA: 0,
    changeBorrowedB: 0
  }
): {
  valueCollateral: number;
  valueA: number;
  valueB: number;
} => {
  const valueCollateralCandidate = collateralDeposited + changes.changeCollateral;
  const amountA = tokenABorrowed + changes.changeBorrowedA;
  const amountB = tokenBBorrowed + changes.changeBorrowedB;
  const valueACandidate = amountA * tokenADenomLPPrice;
  const valueBCandidate = amountB * tokenBDenomLPPrice;

  return {
    valueCollateral: valueCollateralCandidate > 0 ? valueCollateralCandidate : 0,
    valueA: valueACandidate > 0 ? valueACandidate : 0,
    valueB: valueBCandidate > 0 ? valueBCandidate : 0
  };
};

export default getValues;
