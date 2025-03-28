import {
  BaseTextInput,
  CountrySelect,
  EmailInput,
  PasswordInput,
  PhoneInput,
  PrimaryButton,
  BaseTextInputWithValue
} from "../../../common/Inputs";
import { useEffect,useState } from "react";
import {Link, useLocation} from "react-router-dom";

const SignupForm = ({ handler }) => {
  const [referral_code, setReferralCode] = useState('');
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral = params?.get('referral');
    if (referral) {
      setReferralCode(referral);
    }
  }, [location.search]);


  
  return (
    <form
      onSubmit={handler}
      className={
        `flex flex-col items-center gap-6
        w-full`
      }
    >
      <BaseTextInput name='name' className='rounded w-full' placeholder='Name'/>
      <EmailInput name='email' className='rounded w-full'/>
      <CountrySelect name='country' className='rounded w-full'/>
      <PhoneInput name='phone' className='rounded w-full'/>
      <PasswordInput name='password' className='rounded w-full'/>
      <PasswordInput name='password_confirmation' className='rounded w-full' placeholder='Confirm Password'/>
      {
        referral_code ? (
            <BaseTextInputWithValue name='referral' className='rounded w-full' value={referral_code} required={false}/>
          ) :
          <BaseTextInput name='referral' className='rounded w-full' placeholder='Referral Code (optional)'
                         required={false}/>
      }
      <PrimaryButton>Continue</PrimaryButton>
      <p className='text-center'>Already have an account or want to use Google? <Link className='underline' to={'/login'}>Login</Link></p>
    </form>
  )
}

export default SignupForm;