import Header from "../../../components/Header";
import {API, Auth} from "aws-amplify";
import {useContext, useState} from "react";
import {toast} from "react-toastify";
import SignupForm from "./SignupForm";
import OtpForm from "./OtpForm";
import countries from "../../../common/Inputs/countries.json";
import InstitutionContext from "../../../Context/InstitutionContext";
import {useNavigate} from "react-router-dom";
import Context from "../../../Context/Context";
import {FormWrapper} from "../../../common/Layouts";

const Signup = () => {
  const { setLoader } = useContext(Context).util;
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const [formState, setFormState] = useState('signup');
  const [userData, setUserData] = useState({});
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    if (event.target.password.value !== event.target.password_confirmation.value) {
      toast.error('Passwords do not match');
      return;
    }

    let userCountry = '';
    for (let country of countries) {
      if (country.value === event.target.country.value) {
        console.log(country.name);
        userCountry = country.name.split(' (')[0];
        break;
      }
    }

    setLoader(true);
    try {
      await Auth.signUp({
        username: event.target.email.value,
        password: event.target.password.value,
      });

      setUserData({
        userName: event.target.name.value,
        emailId: event.target.email.value,
        phoneNumber: `+${event.target.country.value}${event.target.phone.value}`,
        country: userCountry,
        referred_code: event.target.referral.value,
      });
      setPassword(event.target.password.value);
      setFormState('confirm');
    } catch (e) {
      console.log(e);
      toast.error('Error signing up');
    } finally {
      setLoader(false);
    }
  }

  const confirmSignup = async (event) => {
    event.preventDefault();

    setLoader(true);
    try {
      await Auth.confirmSignUp(userData.emailId, event.target.otp.value);
      await Auth.signIn(userData.emailId, password);

      await API.post(
        'main',
        `/user/profile/${InstitutionId}`,
        {
          body: userData,
        }
      );

      setLoader(false);
      navigate('/redirect');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoader(false);
    }
  }

  const resendHandler = async () => {
    await Auth.resendSignUp(userData.emailId);
  }

  return (
    <FormWrapper heading='Signup'>
      {formState === 'signup' ? <SignupForm handler={handleSignup} /> :
        <OtpForm handler={confirmSignup} resendHandler={resendHandler} />}
    </FormWrapper>
  );
}

export default Signup;