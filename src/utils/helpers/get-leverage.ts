
import { Changes } from 'types/interfaces';

const getLeverage = (
  valueCollateralWithoutChanges: number,
  valueAWithoutChanges: number,
  valueBWithoutChanges: number,
  changes: Changes = {
    changeBorrowedA: 0,
    changeBorrowedB: 0,
    changeCollateral: 0
  }
): number => {
  const valueCollateral = valueCollateralWithoutChanges + changes.changeCollateral;
  const valueA = valueAWithoutChanges + changes.changeBorrowedA;
  const valueB = valueBWithoutChanges + changes.changeBorrowedB;

  const valueDebt = valueA + valueB;
  if (valueDebt === 0) return 1;

  const equity = valueCollateral - valueDebt;
  if (equity <= 0) return Infinity;

  return valueDebt / equity + 1;
};

export default getLeverage;
