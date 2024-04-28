// src/App.js

import React, { useState } from 'react';
import { Container, Form, Dropdown, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import pdsinstance from '../ethereum/pdsinstance';

const options = [
  { key: 'phh', text: 'PHH (Above Poverty Line)', value: 'PHH' },
  { key: 'phh-aay', text: 'PHH-AAY (Below Poverty Line)', value: 'PHH-AAY' },
  { key: 'nphh', text: 'NPHH (Antyodaya Anna Yojana)', value: 'NPHH' },
  { key: 'nphh-s', text: 'NPHH-S (Antyodaya Anna Yojana)', value: 'NPHH-S' },
];



const DashboardPage = () => {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [rationCardType, setRationCardType] = useState('');

useEffect(() => {
    fetchDataFromContract();
  }, []);

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Submitted:', adults, children, rationCardType);
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths='equal'>
          <Form.Input
            label='Number of Adults'
            type='number'
            value={adults}
            onChange={(e, { value }) => setAdults(value)}
          />
          <Form.Input
            label='Number of Children'
            type='number'
            value={children}
            onChange={(e, { value }) => setChildren(value)}
          />
          <Form.Field>
            <label>Ration Card Type</label>
            <Dropdown
              placeholder='Select Ration Card Type'
              fluid
              selection
              options={options}
              value={rationCardType}
              onChange={(e, { value }) => setRationCardType(value)}
            />
          </Form.Field>
        </Form.Group>
        <Button type='submit'>Submit</Button>
      </Form>
    </Container>
  );
};

export default DashboardPage;
