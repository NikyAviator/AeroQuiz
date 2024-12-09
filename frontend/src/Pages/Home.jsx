import '../scss/styles.scss';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const Home = () => {
  return (
    <>
      <Container className='d-flex flex-column align-items-center text-center py-5'>
        <h1>Welcome to AeroQuiz</h1>
        <p className='text-wrapper mt-4'>
          AeroQuiz is your go-to platform for mastering essential knowledge in
          aviation. Whether you're studying for your PPL or ATPL, we've
          collected questions across various critical subjects, including{' '}
          <strong>Meteorology</strong>, <strong>Navigation</strong>,
          <strong>Principles of Flight</strong>, and more.
        </p>
        <p className='text-wrapper mt-3'>
          Designed by aviation enthusiasts for aspiring pilots, AeroQuiz
          provides a challenging and engaging way to test your knowledge and
          prepare for exams. Ready to take off? Sign up to unlock all quizzes
          and start your journey toward becoming a skilled aviator!
        </p>

        <Button href='/signup' variant='secondary' className='mt-5'>
          Sign Up
        </Button>
      </Container>
    </>
  );
};

export default Home;
