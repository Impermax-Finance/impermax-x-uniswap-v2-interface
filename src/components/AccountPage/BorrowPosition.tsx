import React from "react";
import { PoolTokenType } from "../../impermax-router/interfaces";
import { formatUSD, formatPercentage, formatAmount } from "../../utils/format";
import usePairAddress from "../../hooks/usePairAddress";
import { useTokenIcon, useLendingPoolUrl } from "../../hooks/useUrlGenerator";
import useAccount from "../../hooks/useAccount";
import { useSymbol } from "../../hooks/useData";
import { useCollateralAmount, useCollateralValue, useBorrowedAmount, useBorrowedValue, useBorrowerEquityValue } from "../../hooks/useAccountData";
import { Row, Col } from "react-bootstrap";


export default function BorrowPosition() {
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const collateralValue = useCollateralValue();
  const borrowedValueA = useBorrowedValue(PoolTokenType.BorrowableA);
  const borrowedValueB = useBorrowedValue(PoolTokenType.BorrowableB);
  const equityValue = useBorrowerEquityValue();
  const tokenIconA = useTokenIcon(PoolTokenType.BorrowableA);
  const tokenIconB = useTokenIcon(PoolTokenType.BorrowableB);

  return (<Row className="position">
    <Col className="currency-name">
      <div className="combined">
        <div className="currency-overlapped">
          <img src={tokenIconA} />
          <img src={tokenIconB} />
        </div>
        {symbolA}/{symbolB}
      </div>
    </Col>
    <Col className="borrow-balance-details">
      <Row>
        <Col className="details-name d-none d-md-block">
          <div>LP Balance</div>
          <div>{symbolA} Borrowed</div>
          <div>{symbolB} Borrowed</div>
        </Col>
        <Col className="details-value d-none d-md-block">
          <div>+{formatUSD(collateralValue)}</div>
          <div>-{formatUSD(borrowedValueA)}</div>
          <div>-{formatUSD(borrowedValueB)}</div>
        </Col>
        <Col className="details-net">
          <div>{formatUSD(equityValue)}</div>
        </Col>
      </Row>
    </Col>
  </Row>);
}