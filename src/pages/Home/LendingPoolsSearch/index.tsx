
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import LendingPoolsTable from './LendingPoolsTable';

const LendingPoolsSearch = (): JSX.Element => (
  <Row>
    <Col sm={12}>
      <Card className='overflow-hidden'>
        <Card.Body>
          <LendingPoolsTable />
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default LendingPoolsSearch;
