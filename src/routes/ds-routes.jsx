// Packages
import { Routes, Route } from 'react-router-dom';

// Local
import Home from '../pages/public/Home';
import Login from '../pages/auth/Login';
import Error from '../pages/Error';
import Logout from "../pages/auth/Logout";


// Code
const RoutesContainer = () => {
  return (
    <Routes>
      <Route path='/' element={ <Home /> } />
      <Route path='/login' element={ <Login /> } />
      <Route path='/logout' element={ <Logout /> } />
      <Route path='*' element={ <Error /> } />
    </Routes>
  )
}

export default RoutesContainer;