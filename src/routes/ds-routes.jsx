// Packages
import { Routes, Route } from 'react-router-dom';

// Local
import Home from '../pages/public/Home';
import Error from '../pages/Error';


// Code
const RoutesContainer = () => {
  return (
    <Routes>
      <Route path='/' element={ <Home /> } />
      <Route path='*' element={ <Error /> } />
    </Routes>
  )
}

export default RoutesContainer;