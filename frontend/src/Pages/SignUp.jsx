import axios from 'axios';
import '../scss/styles.scss';
import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import SuccessPopup from '../Components/SuccessPopup';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner while waiting for the response
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        formData
      );

      setLoading(false); // Hide spinner
      setSuccessMessage('User created successfully!'); // Set success message
      setShowSuccess(true); // Show success popup

      console.log('User created successfully:', response.data);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      setLoading(false); // Hide spinner
      console.error(
        'Error creating user:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      {/* Render Spinner when loading */}
      {loading && <Spinner />}

      {/* Render Success Popup */}
      <SuccessPopup
        show={showSuccess}
        handleClose={() => setShowSuccess(false)}
        message={successMessage}
      />

      {/* Main Form */}
      <Container className='d-flex align-items-center justify-content-center py-5'>
        <Row>
          <Col>
            <h2 className='text-center mb-4'>Sign Up</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='formFirstName' className='mb-3'>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter your first name'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId='formLastName' className='mb-3'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter your last name'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId='formUserName' className='mb-3'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Choose a username'
                  name='userName'
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId='formEmail' className='mb-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter your email'
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
                  placeholder='Create a password'
                  name='password'
                  value={formData.password}
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
    </>
  );
};

export default SignUp;
