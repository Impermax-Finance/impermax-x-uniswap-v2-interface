import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { LanguageContext } from '../../contexts/Language';
import { LendingPoolsTable } from './../LendingPoolsTable';
import phrases from './translations';
import './index.scss';

export function SearchForm() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;

  const t = (s: string) => (phrases[s][language]);

  return (<InputGroup>
    <FormControl
       placeholder={t("Search Uniswap V2 LP Token")}
    />
    <InputGroup.Append>
      <Button variant="primary">Search</Button>
    </InputGroup.Append>
  </InputGroup>);
}

/**
 * Creates a searchable list of Lending Pools.
 */
export default function LendingPoolsSearch() {
  return(<div className='lending-pools-search'>
    <Container>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Body>
              {/*<SearchForm />*/}
              <LendingPoolsTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>);
}