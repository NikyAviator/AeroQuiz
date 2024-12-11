import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import LogIn from './Pages/LogIn';
import Header from './Components/Header'; // Full Header
import SmallHeader from './Components/SmallHeader'; // Small Header
import Footer from './Components/Footer';

const App = () => {
  const location = useLocation();

  // Determine if the current route is the home page
  const isHomePage = location.pathname === '/';

  return (
    <div className='d-flex flex-column min-vh-100'>
      {/* Conditionally render Header or SmallHeader */}
      {isHomePage ? <Header /> : <SmallHeader />}
      <main className='flex-grow-1'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<LogIn />} />
          {/* Add other routes here */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
