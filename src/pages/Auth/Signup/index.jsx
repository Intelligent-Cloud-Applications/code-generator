import Header from "../../../components/Header";
import { API, Auth } from "aws-amplify";
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import SignupForm from "./SignupForm";
import OtpForm from "./OtpForm";
import countries from "../../../common/Inputs/countries.json";
import InstitutionContext from "../../../Context/InstitutionContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Context from "../../../Context/Context";
import { FormWrapper } from "../../../common/Layouts";

const Signup = () => {
  const { setLoader } = useContext(Context).util;
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const [formState, setFormState] = useState('signup');
  const [userData, setUserData] = useState({});
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Variables to store trial status and period from URL
  const [trialStatus, setTrialStatus] = useState(null);
  const [trialPeriod, setTrialPeriod] = useState(null);
  // const {trial,trialPeriod} = useParams();
  // Extract trial params from URL
  const params = new URLSearchParams(location.search);
  const trial = params.get('trial');
  const period = params.get('trialPeriod');
  useEffect(() => {
    console.log(trial)
    if (trial === "true" && period) {
      setTrialStatus("Trial");
      // trial = true;
      setTrialPeriod(period);  // e.g., 'Monthly', 'Quarterly', etc.
    }
  }, [location.search]);

  const handleSignup = async (event) => {
    event.preventDefault();

    if (event.target.password.value !== event.target.password_confirmation.value) {
      toast.error('Passwords do not match');
      return;
    }

    let userCountry = '';
    for (let country of countries) {
      if (country.value === event.target.country.value) {
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

      // Prepare user data including trial status and period
      const userPayload = {
        userName: event.target.name.value,
        emailId: event.target.email.value,
        phoneNumber: `+${event.target.country.value}${event.target.phone.value}`,
        country: userCountry,
        referred_code: event.target.referral.value,
        status: trialStatus || "InActive",  // Set status to Trial if URL param exists
        trialPeriod: trialPeriod || null,  // Add trialPeriod from URL
        trial: trial
      };

      setUserData(userPayload);
      setPassword(event.target.password.value);
      setFormState('confirm');
    } catch (e) {
      console.log(e);
      toast.error('Error signing up');
    } finally {
      setLoader(false);
    }
  };

  const confirmSignup = async (event) => {
    event.preventDefault();
    // const queryString = `?trial=${trial}&trialPeriod=${period}`;
    setLoader(true);
    try {
      await Auth.confirmSignUp(userData.emailId, event.target.otp.value);
      await Auth.signIn(userData.emailId, password);

      // Send user data to API
      await API.post(
        'main',
        `/user/profile/${InstitutionId}`,
        {  
          queryStringParameters: {
          trial: trial,
          trialPeriod: trialPeriod,
        },
          body: {
            ...userData,
            trial: trial,
            trialPeriod: trialPeriod
          },
        }
      );

      setLoader(false);
      navigate('/redirect');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoader(false);
    }
  };

  const resendHandler = async () => {
    await Auth.resendSignUp(userData.emailId);
  };

  // Function to calculate trial end date based on the period
  const calculateTrialEndDate = (period) => {
    const currentDate = Date.now();
    let endDate;
    switch (period) {
      case "Monthly":
        endDate = currentDate + (30 * 24 * 60 * 60 * 1000); // 30 days
        break;
      case "Quarterly":
        endDate = currentDate + (90 * 24 * 60 * 60 * 1000); // 90 days
        break;
      case "Half-yearly":
        endDate = currentDate + (180 * 24 * 60 * 60 * 1000); // 180 days
        break;
      case "Yearly":
        endDate = currentDate + (365 * 24 * 60 * 60 * 1000); // 365 days
        break;
      default:
        endDate = null;
    }
    return endDate;
  };

  return (
    <FormWrapper heading='Signup'>
      {formState === 'signup' ? <SignupForm handler={handleSignup} /> :
        <OtpForm handler={confirmSignup} resendHandler={resendHandler} />}
    </FormWrapper>
  );
};

export default Signup;
