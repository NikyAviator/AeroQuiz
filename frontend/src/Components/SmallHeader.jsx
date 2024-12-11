import '../scss/styles.scss';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const SmallHeader = () => {
  return (
    <Navbar expand='lg' className='small-navbar'>
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
  );
};

export default SmallHeader;
