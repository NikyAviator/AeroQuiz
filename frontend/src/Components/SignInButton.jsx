import '../scss/styles.scss';
import Button from 'react-bootstrap/Button';

const SignInButton = () => {
  return (
    <Button href='/login' variant='outline-light' className='sign-in-button'>
      <i className='bi bi-airplane me-2'></i> {/* Bootstrap airplane icon */}
      Sign In
    </Button>
  );
};

export default SignInButton;
