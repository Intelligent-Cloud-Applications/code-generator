import {OtpInput, PrimaryButton} from "../../../common/Inputs";
import {Auth} from 'aws-amplify';
import {useDispatch} from "react-redux";
import {fetchUserData} from "../../../redux/store/userSlice";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";

const OtpForm = ({ signinResponse, setSigninResponse }) => {
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const navigate = useNavigate();
  
  const confirmOtp = async (event) => {
    event.preventDefault();
    const OTP = event.target.otp.value;
  
    try {
      console.log(Auth, signinResponse, OTP);
      const user = await Auth.sendCustomChallengeAnswer(signinResponse, OTP);
      console.log(await Auth.currentSession());
      if (user) {
        dispatch(fetchUserData());
        alert('Logged In');
        navigate(redirect ? `/${redirect}` : '/dashboard');
      } else {
        setErrorText('Incorrect Phone Number');
      }
    } catch (e) {
      setErrorText(e.message);
    }
  };
  
  return (
    <form
      onSubmit={confirmOtp}
      className={
        `flex flex-col items-center gap-6
        w-full`
      }
    >
      <OtpInput name='otp' />
      <PrimaryButton>Login</PrimaryButton>
      <p className='text-red-400'>{errorText}</p>
    </form>
  )
}

export default OtpForm;