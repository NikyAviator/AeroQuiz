import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import LogIn from './Pages/LogIn';
import Header from './Components/Header';
import Footer from './Components/Footer';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Clear previous background class
    document.body.className = '';

    // Set background class based on current path
    if (location.pathname === '/') {
      document.body.classList.add('background-home');
    } else if (location.pathname === '/signup') {
      document.body.classList.add('background-signup');
    } else if (location.pathname === '/login') {
      document.body.classList.add('background-login');
    }
  }, [location]);

  return (
    <>
      <div className='d-flex flex-column min-vh-100'>
        <Header />
        <main className='flex-grow-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<LogIn />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

const WrappedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default WrappedApp;
