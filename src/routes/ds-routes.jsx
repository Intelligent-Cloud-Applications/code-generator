// Packages
import { Routes, Route } from 'react-router-dom';

// Local
import Home from '../pages/public/Home';


// Code
const RoutesContainer = () => {
  return (
    <Routes>
      <Route path='/' element={ <Home /> } />
    </Routes>
  )
}

export default RoutesContainer;