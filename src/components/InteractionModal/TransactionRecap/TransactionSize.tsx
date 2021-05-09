import { Row, Col } from 'react-bootstrap';
import { PoolTokenType } from '../../../impermax-router/interfaces';
import usePoolToken from '../../../hooks/usePoolToken';
import { formatFloat } from '../../../utils/format';
import { useSymbol, usePriceDenomLP } from '../../../hooks/useData';

export interface TransactionSizeProps {
  amount: number;
}

export default function TransactionSize({ amount }: TransactionSizeProps): JSX.Element | null {
  const poolTokenType = usePoolToken();
  // eslint-disable-next-line eqeqeq
  if (poolTokenType != PoolTokenType.Collateral) return null;

  // ray test touch <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tokenPriceA, tokenPriceB] = usePriceDenomLP();
  // ray test touch >

  return (
    <Row>
      <Col xs={6}>Transaction size:</Col>
      <Col
        xs={6}
        className='text-right'>
        {formatFloat(amount / 2 / tokenPriceA)} {symbolA}
        <br /> +
        {formatFloat(amount / 2 / tokenPriceB)} {symbolB}
      </Col>
    </Row>
  );
}
