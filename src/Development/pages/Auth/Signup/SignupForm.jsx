import {
  BaseTextInput,
  CountrySelect,
  EmailInput,
  PasswordInput,
  PhoneInput,
  PrimaryButton,
  BaseTextInputWithValue
} from "../../../common/Inputs";
import {useContext, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import {Auth} from "aws-amplify";
import {CognitoHostedUIIdentityProvider} from "@aws-amplify/auth";
import {HR} from "flowbite-react";
import InstitutionContext from "../../../Context/InstitutionContext";

const customTheme = {
  "hrLine": "my-4 h-px w-64 border-0 bg-gray-700 dark:bg-gray-200"
}

const SignupForm = ({ handler }) => {
  const { productId } = useContext(InstitutionContext).institutionData;
  const [referral_code, setReferralCode] = useState('');
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral = params?.get('referral');
    if (referral) {
      setReferralCode(referral);
    }
  }, [location.search]);

  const [name, setName] = useState("");


  
  return (
    <form
      onSubmit={handler}
      className={
        `flex flex-col items-center gap-6
        w-full`
      }
    >
      {productId === "1000007" && (
        <>
          <button
            className="flex items-center bg-white text-black px-4 py-2 border rounded-md"
            type='button'
            onClick={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google})}
          >
            <img
              className="w-6 h-6 mr-2"
              src="https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png"
              alt="Google Icon"
            />
            Sign up with Google
          </button>
          <HR.Text text='or' theme={customTheme}/>
        </>
      )}
      <BaseTextInput name='name' className='rounded w-full' placeholder='Name' pattern='[A-Za-z\ ]' value={name}
                     onChange={(e) => {if (/^[^0-9]*$/.test(e.target.value)) setName(e.target.value)}}/>
      <EmailInput name='email' className='rounded w-full'/>
      <CountrySelect name='country' className='rounded w-full'/>
      <PhoneInput name='phone' className='rounded w-full'/>
      <PasswordInput name='password' className='rounded w-full'/>
      <PasswordInput name='password_confirmation' className='rounded w-full' placeholder='Confirm Password'/>
      {
        referral_code ? (
          <BaseTextInputWithValue name='referral' className='rounded w-full' value={referral_code} required={false}/>
        ):
      <BaseTextInput name='referral' className='rounded w-full' placeholder='Referral Code (optional)'
        required={false}/>
      }
      <PrimaryButton className="hover:opacity-[90%]">Continue</PrimaryButton>
    </form>
  )
}

export default SignupForm;