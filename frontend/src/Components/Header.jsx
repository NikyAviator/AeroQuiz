import '../scss/styles.scss';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Header = () => {
  return (
    <Navbar expand='lg' className='bg-secondary'>
      <Container>
        <Navbar.Brand href='/'>
          <img
            alt=''
            src='public/airplane.png'
            width='30'
            height='30'
            className='d-inline-block align-top'
          />{' '}
          AeroQuiz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link href='/'>Home</Nav.Link>
            <Nav.Link href='/login'>Log In</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
