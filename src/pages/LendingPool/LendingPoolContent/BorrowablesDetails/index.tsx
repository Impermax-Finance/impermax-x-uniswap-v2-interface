
import {
  Row,
  Col,
  Card
} from 'react-bootstrap';

import BorrowableDetails from './BorrowableDetails';
import { PoolTokenType } from 'types/interfaces';
import PoolTokenContext from 'contexts/PoolToken';
import './index.scss';

const BorrowablesDetails = (): JSX.Element => {
  return (
    <div className='borrowables-details'>
      <Row>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
                <BorrowableDetails />
              </PoolTokenContext.Provider>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
                <BorrowableDetails />
              </PoolTokenContext.Provider>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BorrowablesDetails;
