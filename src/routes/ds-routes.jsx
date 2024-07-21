// Packages
import {Routes, Route, Navigate} from 'react-router-dom';

// Local
import Home from '../pages/public/Home';
import Login from '../pages/auth/Login';
import Error from '../pages/Error';
import Logout from "../pages/auth/Logout";
import DashBoard from "../pages/private/Dashboard";
import {useContext, useEffect} from "react";
import Context from "../Context/Context";
//import Signup from "../pages/auth/Signup";
import { useNavigate } from 'react-router-dom';


//const Navigate = ({to}) => {
//  const navigate = useNavigate();
//  useEffect(() => {
//    navigate(to);
//  }, [])
//  return (
//    <div></div>
//  )
//}


// Code
const RoutesContainer = () => {
  const { isAuth } = useContext(Context);

  return (
    <Routes>
      <Route path='/' element={ <Home /> } />
      <Route path='/login' element={ <Login /> } />
      <Route path='/logout' element={ <Logout /> } />
      {/*<Route path='/signup' element={ <Signup /> } />*/}
      <Route path='/dashboard' element={ <DashBoard /> } />
      <Route path='*' element={ <Error /> } />
    </Routes>
  )
}

export default RoutesContainer;