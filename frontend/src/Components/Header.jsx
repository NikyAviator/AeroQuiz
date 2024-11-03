import '../scss/styles.scss';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  return (
    <Navbar expand='lg' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>AeroQuiz</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
