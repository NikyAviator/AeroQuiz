import '../scss/styles.scss';
import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and sign-up logic here
    console.log('Sign-Up Data:', formData);
  };

  return (
    <Container className='d-flex align-items-center justify-content-center py-5'>
      <Row>
        <Col>
          <h2 className='text-center mb-4'>Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='formName' className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your full name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId='formEmail' className='mb-3'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId='formPassword' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId='formConfirmPassword' className='mb-3'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Re-enter Password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId='formTerms' className='mb-3'>
              <Form.Check
                type='checkbox'
                label='I agree to the Terms and Conditions'
                name='termsAccepted'
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant='primary' type='submit' className='w-100'>
              Sign Up
            </Button>
          </Form>
          <div className='text-center mt-3'>
            <small>
              Already have an account? <a href='/login'>Log In</a>
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
