import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import LogIn from './Pages/LogIn';
import HomeLayout from './Components/Layouts/HomeLayout';
import DefaultLayout from './Components/Layouts/DefaultLayout';

const App = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <HomeLayout>
            <Home />
          </HomeLayout>
        }
      />
      <Route
        path='/signup'
        element={
          <DefaultLayout>
            <SignUp />
          </DefaultLayout>
        }
      />
      <Route
        path='/login'
        element={
          <DefaultLayout>
            <LogIn />
          </DefaultLayout>
        }
      />
      {/* Add other routes here */}
    </Routes>
  );
};

export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
