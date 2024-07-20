// Packages
import { Routes, Route } from 'react-router-dom';

// Local
import Home from '../pages/public/Home';
import Login from '../pages/auth/Login';
import Error from '../pages/Error';
import Logout from "../pages/auth/Logout";
import Signup from "../pages/auth/Signup";


// Code
const RoutesContainer = () => {
  return (
    <Routes>
      <Route path='/' element={ <Home /> } />
      <Route path='/login' element={ <Login /> } />
      <Route path='/logout' element={ <Logout /> } />
      <Route path='/signup' element={ <Signup /> } />
      <Route path='*' element={ <Error /> } />
    </Routes>
  )
}

export default RoutesContainer;