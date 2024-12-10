import '../scss/styles.scss';
import Container from 'react-bootstrap/Container';

const Home = () => {
  return (
    <>
      <Container className='d-flex flex-column align-items-center text-center py-5'>
        <h1>Welcome to AeroQuiz</h1>
        <h2>Home.jsx</h2>
      </Container>
    </>
  );
};

export default Home;
