import {OtpInput, PrimaryButton} from "../../../common/Inputs";
import {API, Auth} from 'aws-amplify';
//import {useDispatch} from "react-redux";
//import {fetchUserData} from "../../../redux/store/userSlice";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useContext, useState} from "react";
import institutionContext from "../../../Context/InstitutionContext";
import Context from "../../../Context/Context";
import {toast} from "react-toastify";

const OtpForm = ({ signinResponse, setSigninResponse }) => {
  const { InstitutionId } = useContext(institutionContext).institutionData;
  const { setUserData, setIsAuth, onAuthLoad, util } = useContext(Context);
  const [errorText, setErrorText] = useState('');
//  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const navigate = useNavigate();
  
  const confirmOtp = async (event) => {
    event.preventDefault();
    util.setLoader(true);
    const OTP = event.target.otp.value;
  
    try {
      console.log(Auth, signinResponse, OTP);
      const user = await Auth.sendCustomChallengeAnswer(signinResponse, OTP);
      console.log(await Auth.currentSession());
      if (user) {
        const userdata = await API.get(
          'main',
          `/user/profile/${InstitutionId}`
        );
        setUserData(userdata);
        setIsAuth(true);
        util.setLoader(false);
        toast.info('Logged In');
        onAuthLoad(true, InstitutionId);
//        dispatch(fetchUserData());
        navigate(redirect ? `/${redirect}` : '/dashboard');
      } else {
        setErrorText('Incorrect Phone Number');
        util.setLoader(false);
      }
    } catch (e) {
      console.log(e);
      setErrorText(e.message);
      util.setLoader(false);
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
      <OtpInput name='otp' className='w-full rounded'/>
      <PrimaryButton>Login</PrimaryButton>
      <p className='text-red-400'>{errorText}</p>
    </form>
  )
}

export default OtpForm;