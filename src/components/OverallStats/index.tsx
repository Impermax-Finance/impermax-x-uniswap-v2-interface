import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useTotalValueLocked, useTotalValueSupplied, useTotalValueBorrowed } from '../../hooks/useData';
import { formatUSD } from '../../utils/format';
import './index.scss';
import { useAccountTotalValueLocked, useAccountTotalValueSupplied, useAccountTotalValueBorrowed } from '../../hooks/useAccountData';

interface OverallStatsInternalProps {
  totalValueLocked: number;
  totalValueSupplied: number;
  totalValueBorrowed: number;
}

function OverallStatsInternal({ totalValueLocked, totalValueSupplied, totalValueBorrowed } : OverallStatsInternalProps): JSX.Element {
  return (
    <Container className='overall-stats'>
      <Card>
        <Row>
          <Col
            xs={12}
            md={4}
            className='col'>
            <div className='name'>Total value locked:</div>
            <div className='value'>{formatUSD(totalValueLocked)}</div>
          </Col>
          <Col
            xs={12}
            md={4}
            className='col'>
            <div className='name'>Total supplied:</div>
            <div className='value'>{formatUSD(totalValueSupplied)}</div>
          </Col>
          <Col
            xs={12}
            md={4}
            className='col'>
            <div className='name'>Total borrowed:</div>
            <div className='value'>{formatUSD(totalValueBorrowed)}</div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default function OverallStats(): JSX.Element {
  const totalValueLocked = useTotalValueLocked();
  const totalValueSupplied = useTotalValueSupplied();
  const totalValueBorrowed = useTotalValueBorrowed();

  return (<OverallStatsInternal
    totalValueLocked={totalValueLocked}
    totalValueSupplied={totalValueSupplied}
    totalValueBorrowed={totalValueBorrowed} />);
}

export function AccountOverallStats(): JSX.Element {
  const totalValueLocked = useAccountTotalValueLocked();
  const totalValueSupplied = useAccountTotalValueSupplied();
  const totalValueBorrowed = useAccountTotalValueBorrowed();

  return (<OverallStatsInternal
    totalValueLocked={totalValueLocked}
    totalValueSupplied={totalValueSupplied}
    totalValueBorrowed={totalValueBorrowed} />);
}
