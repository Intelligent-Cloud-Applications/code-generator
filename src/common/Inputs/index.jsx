// Packages
import React, {useContext, useState} from 'react';

// Local
import countries from './countries.json';
import institutionContext from "../../Context/InstitutionContext";
//import {useSelector} from "react-redux";

export const CountrySelect = (props) => {
  const { country, setCountry } = useState(91);
  
  return (
    <select
      value={country}
      onChange={setCountry}
      {...props}
    >
      {countries.map((item, index) =>
        <option key={ index } value={ item.value }>
          { item.name }
        </option>
      )}
    </select>
  )
}


export const PhoneInput = (props) => {
  return (
    <input
      type='tel'
      placeholder='Phone Number'
      required
      pattern='[0-9]{9,10}'
      title='Phone Numbers are 9 or 10 digits'
      {...props}
    />
  )
}


export const EmailInput = (props) => {
  return (
    <input
      type='email'
      placeholder='Email Address'
      required
      {...props}
    />
  )
}


export const OtpInput = (props) => {
  return (
    <input
      type='text'
      placeholder='OTP'
      required
      pattern='[0-9]{6}'
      title='OTP is 6 digits'
      {...props}
    />
  )
}


export const PrimaryButton = ({ children, ...props }) => {
  const { PrimaryColor } = useContext(institutionContext).institutionData;
//  const { PrimaryColor } = useSelector((state) => state.institutionData.data);
  
  return (
    <button
      style={{
        backgroundColor: PrimaryColor,
        width: '150px',
        height: '40px',
        color: 'white',
        borderRadius: '10px'
      }}
      {...props}
    >
      { children }
    </button>
  )
}