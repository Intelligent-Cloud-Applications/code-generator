// Packages
import {Routes, Route, Navigate} from 'react-router-dom';

// Local
import Home from '../pages/public/Home';
import Login from '../pages/auth/Login';
import About from '../pages/public/AboutUs';
import Instructor from '../pages/public/Instructors';
import Error from '../pages/Error';
import Logout from "../pages/auth/Logout";
import DashBoard from "../pages/private/Dashboard";
import {useContext, useEffect} from "react";
import Context from "../Context/Context";
import Signup from "../pages/auth/Signup";
import { useNavigate } from 'react-router-dom';
import Meeting from "../pages/private/Meeting";
import Query from "../pages/public/Query";
import Gallery from '../pages/public/Gallery';
import Schedule from '../pages/public/Schedule';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import Terms from '../pages/public/Terms';
import Refund from '../pages/public/Refund';


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
      <Route path='/aboutus' element={ <About /> } />
      <Route path='/instructor' element={ <Instructor /> } />
      <Route path='/gallery' element={<Gallery/>}/>
      <Route path='/schedule' element={<Schedule/>}/>
      <Route path='/privacypolicy' element={<PrivacyPolicy/>}/>
      <Route path='/terms' element={<Terms/>}/>
      <Route path='/refund' element={<Refund/>}/>
      <Route path='/login' element={ <Login /> } />
      <Route path='/logout' element={ <Logout /> } />
      <Route path='/signup' element={ <Signup /> } />
      <Route path='/dashboard' element={ <DashBoard /> } />
      <Route path='*' element={ <Error /> } />
      <Route path='/meeting' element={ <Meeting /> } />
      <Route path='/query' element={ <Query /> } />
    </Routes>
  )
}

export default RoutesContainer;