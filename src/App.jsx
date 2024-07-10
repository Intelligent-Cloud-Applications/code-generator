// Packages
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";

// Local
import { fetchInstitutionData } from "./redux/store/institutionSlice";
import { fetchUserData } from "./redux/store/userSlice";
import RoutesContainer from './routes';


// Code
const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchInstitutionData());
    dispatch(fetchUserData());
  }, []);
  
  return (
    <RoutesContainer />
  )
}

export default App;