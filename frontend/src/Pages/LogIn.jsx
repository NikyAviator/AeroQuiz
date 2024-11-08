// src/Pages/LogIn.jsx
import '../scss/styles.scss';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <Container className='d-flex align-items-center justify-content-center py-5'>
      <Row>
        <Col>
          <h2 className='text-center mb-4'>Log In</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='formBasicEmail' className='mb-3'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='formBasicPassword' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant='primary' type='submit' className='w-100'>
              Log In
            </Button>
          </Form>
          <div className='text-center mt-3'>
            <a href='#' className='small'>
              Forgot your password?
            </a>
          </div>
          <div className='text-center mt-3'>
            <small>
              Do not have an account? <a href='/signup'>Sign Up</a>
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LogIn;
