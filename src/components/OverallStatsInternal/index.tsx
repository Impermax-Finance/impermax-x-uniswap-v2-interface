
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import { formatUSD } from 'utils/format';

interface Props {
  totalValueLocked: number;
  totalValueSupplied: number;
  totalValueBorrowed: number;
}

const OverallStatsInternal = ({
  totalValueLocked,
  totalValueSupplied,
  totalValueBorrowed
} : Props): JSX.Element => {
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
};

export default OverallStatsInternal;
