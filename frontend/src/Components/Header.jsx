import '../scss/Header.scss';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Header = () => {
  return (
    <div className='header'>
      <Navbar expand='lg' className='content'>
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
    </div>
  );
};

export default Header;
