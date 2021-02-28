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
import './index.scss';

/**
 * Creates a searchable list of Lending Pools.
 */
export default function OverallStats() {
  return(<div className='overall-stats'>
    <Container>
      <Row>
        <Col sm={6}>
          Total value locked: 
        </Col>
        <Col sm={6}>
          Total borrowed: 
        </Col>
      </Row>
    </Container>
  </div>);
}