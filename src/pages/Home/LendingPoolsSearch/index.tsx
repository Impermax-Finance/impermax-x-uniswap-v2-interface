
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';

// import { PAGES } from 'utils/constants/links';
import LendingPoolsTable from './LendingPoolsTable';

// TODO: unused for now
// const SearchForm = (): JSX.Element => {
//   return (
//     <InputGroup>
//       <FormControl placeholder='Search pair by name or address' />
//       <InputGroup.Append>
//         <Button variant='primary'>Search</Button>
//       </InputGroup.Append>
//       <a href={PAGES.CREATE_NEW_PAIR}>
//         <Button>Create New Pair</Button>
//       </a>
//     </InputGroup>
//   );
// };

const LendingPoolsSearch = (): JSX.Element => (
  <Row>
    <Col sm={12}>
      <Card className='overflow-hidden'>
        <Card.Body>
          {/* <SearchForm />*/}
          <LendingPoolsTable />
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default LendingPoolsSearch;
