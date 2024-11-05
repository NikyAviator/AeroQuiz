import './scss/styles.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import LogIn from './Pages/LogIn';
function App() {
  return (
    <>
      <BrowserRouter>
        <header>
          <Header />
        </header>
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LogIn />} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </BrowserRouter>
    </>
  );
}

export default App;
