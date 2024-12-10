import '../scss/Header.scss';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Header = () => {
  return (
    <div className='header'>
      {/* Navbar */}
      <Navbar expand='lg' className='navbar'>
        <Container>
          <Navbar.Brand href='/' className='text-white'>
            AeroQuiz
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar-nav' />
          <Navbar.Collapse id='navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link href='/' className='text-white'>
                Home
              </Nav.Link>
              <Nav.Link href='/signup' className='text-white'>
                Sign Up
              </Nav.Link>
              <Nav.Link href='/login' className='text-white'>
                Log In
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Second Container */}
      <Container className='hero-container'>
        <Row className='align-items-center text-center text-md-start'>
          <Col md={6}>
            <h1 className='hero-title'>
              Master Aviation Knowledge with AeroQuiz
            </h1>
            <p className='hero-description'>
              Prepare for your PPL or ATPL exams with expertly crafted questions
              on Meteorology, Navigation, Principles of Flight, and more.
            </p>
          </Col>
          <Col md={6}>
            <Button
              href='/signup'
              variant='primary'
              size='lg'
              className='hero-button'
            >
              Join Now
            </Button>
            <Button
              href='/login'
              variant='secondary'
              size='lg'
              className='hero-button'
            >
              Sign In
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
