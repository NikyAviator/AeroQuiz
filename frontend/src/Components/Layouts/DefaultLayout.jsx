import SmallHeader from '../SmallHeader';
import Footer from '../Footer';

const DefaultLayout = ({ children }) => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <SmallHeader />
      <main className='flex-grow-1'>{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
