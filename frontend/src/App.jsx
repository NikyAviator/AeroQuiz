import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/sections/header-footer-sections/Header.jsx';
import HomePage from './Pages/HomePage.jsx';
import Footer from './Components/sections/header-footer-sections/Footer.jsx';
import ScrollToTopButton from './Components/ui/ScrollToTopButton.jsx';
import SignIn from './Pages/register-signin/SignIn.jsx';
import Register from './Pages/register-signin/Register.jsx';
import Dashboard from './Pages/logged-in-pages/Dashboard.jsx';
import QuizPage from './Pages/logged-in-pages/QuizPage.jsx';
import ResultPage from './Pages/logged-in-pages/ResultPage.jsx';
import ProtectedRoute from './Components/ui/ProtectedRoute.jsx';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <Header />
        <main className="relative grow">
          <Routes>
            {/* ── Public routes — no auth required ── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />

            {/* ── Protected routes — must be logged in ── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ScrollToTopButton />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
