import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/sections/header-footer-sections/Header.jsx';
import HomePage from './Pages/HomePage.jsx';
import Footer from './Components/sections/header-footer-sections/Footer.jsx';
import ScrollToTopButton from './Components/ui/ScrollToTopButton.jsx';
import SignIn from './Pages/register-signin/SignIn.jsx';
import Register from './Pages/register-signin/Register.jsx';
import LoggedInHomePage from './Pages/logged-in-pages/LoggedInHomePage.jsx';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <Header />
        <main className="relative grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            {/* Protected routes — redirect handled by LoggedInHomePage for now */}
            <Route path="/dashboard" element={<LoggedInHomePage />} />
          </Routes>
          <ScrollToTopButton />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
