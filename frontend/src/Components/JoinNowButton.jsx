import '../scss/styles.scss';
import Button from 'react-bootstrap/Button';

const JoinNowButton = () => {
  return (
    <Button href='/signup' variant='outline-light' className='join-now-button'>
      <i className='bi bi-airplane me-2'></i> {/* Bootstrap airplane icon */}
      Join Now
    </Button>
  );
};

export default JoinNowButton;
