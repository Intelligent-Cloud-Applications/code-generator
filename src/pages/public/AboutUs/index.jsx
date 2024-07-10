// Packages
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import Context from '../context/Context';
import InstitutionContext from '../context/InstitutionContext';

// Components
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';


// Code
const AboutUs = () => {
  const { AboutUs, LightPrimaryColor } = useContext(InstitutionContext)?.institutionData;
  const navigate = useNavigate();
  const { isAuth } = useContext(Context);
  
  
  const paragraphs = AboutUs.map((item, index) =>
    <div key={index}>
      <h2 className='font-bold text-left text-xl max450:text-base'>{ item.title }</h2>
      <p className='text-justify text-lg'>{ item.content }</p>
    </div>
  )
  
  return (
    <div>
      <NavBar />
      <div className='flex flex-column gap-8 px-48 py-16'>
        <h1 className='text-center text-7xl'>About Us</h1>
        {paragraphs}
        <button
          className='w-60 py-2 self-center rounded-lg text-white text-xl'
          style={{ backgroundColor: LightPrimaryColor }}
          onClick={ () => isAuth ? navigate('/dashboard') : navigate('/signup') }
        >
          {isAuth ? 'Dashboard' : 'Sign Up Now'}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
