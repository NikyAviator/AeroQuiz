import './scss/styles.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
function App() {
  return (
    <>
      <BrowserRouter>
        <header></header>
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </main>
        <footer></footer>
      </BrowserRouter>
    </>
  );
}

export default App;
