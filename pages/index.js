import React, { useState } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const IndexPage = () => {
  // State for storing login credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform authentication logic here
    if (username === 'marketyard' && password === 'marketyard') {
      console.log("marketyard");
      window.location.href = 'http://localhost:3000/marketyard';
    } else if (username === 'warehouse' && password === 'warehouse') {
      // Redirect user to website 2
      window.location.href = 'http://localhost:3000/warehouse';
    } else if (username === 'rationshop' && password === 'rationshop') {
      // Redirect user to website 3
      window.location.href = 'http://localhost:3000/rationshop';
    } else {
      // Redirect user to website 4 for any other cases or incorrect credentials
      window.location.href = 'http://localhost:3000/';
    }
    // Resetting form fields
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-form">
      <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Log-in to your account
          </Header>
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button color="teal" fluid size="large" type="submit">
                Login
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default IndexPage;