import Header from "../../../components/Header";
import { API, Auth } from "aws-amplify";
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import SignupForm from "./SignupForm";
import OtpForm from "./OtpForm";
import countries from "../../../common/Inputs/countries.json";
import InstitutionContext from "../../../Context/InstitutionContext";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Context from "../../../Context/Context";
import { FormWrapper } from "../../../common/Layouts";

const Signup = () => {
  const { setLoader } = useContext(Context).util;
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const [formState, setFormState] = useState("signup");
  const [userData, setUserData] = useState({});
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Variables to store trial status and period from URL
  const [trialStatus, setTrialStatus] = useState(null);
  const [trialPeriod, setTrialPeriod] = useState(null);
  
  // Extract trial params from URL
  const params = new URLSearchParams(location.search);
  const trial = params.get("trial");
  const period = params.get("trialPeriod");
  const hybridPath = params.get("hybrid");
  
  useEffect(() => {
    if (trial === "true" && period) {
      setTrialStatus("Trial");
      setTrialPeriod(period); // e.g., 'Monthly', 'Quarterly', etc.
    }
  }, [location.search]);

  const handleSignup = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.toLowerCase();

    let userCountry = "";
    for (let country of countries) {
      if (country.value === event.target.country.value) {
        userCountry = country.name.split(" (")[0];
        break;
      }
    }

    setLoader(true);
    try {
      await Auth.signUp({
        username: email,
        password: event.target.password.value,
      });

      // Prepare user data including trial status and period
      const userPayload = {
        userName: event.target.name.value,
        emailId: email,
        phoneNumber: `+${event.target.country.value}${event.target.phone.value}`,
        country: userCountry,
        referred_code: event.target.referral.value,
        status: trialStatus || "InActive", // Set status to Trial if URL param exists
        trialPeriod: trialPeriod || null, // Add trialPeriod from URL
        trial: trial,
      };

      setUserData(userPayload);
      setPassword(event.target.password.value);
      setFormState("confirm");
    } catch (e) {
      console.log(e);
      if (e.name === 'UsernameExistsException')
        toast.error("User already exists.");
      else if (e.name === 'InvalidPasswordException')
        toast.error(e.message);
      else
        toast.error("Error signing up");
    } finally {
      setLoader(false);
    }
  };

  const confirmSignup = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      await Auth.confirmSignUp(userData.emailId, event.target.otp.value);
      await Auth.signIn(userData.emailId, password);

      // Send user data to API
      await API.post("main", `/user/profile/${InstitutionId}`, {
        queryStringParameters: {
          trial: trial,
          trialPeriod: trialPeriod,
          hybrid: hybridPath,
        },
        body: {
          ...userData,
          trial: trial,
          trialPeriod: trialPeriod,
        },
      });

      setLoader(false);
      if(productId){
        navigate(`/redirect?productId=${productId}`);
      }else{
        navigate(`/redirect`);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoader(false);
    }
  };

  const resendHandler = async () => {
    await Auth.resendSignUp(userData.emailId);
  };

  return (
    <FormWrapper>
      {formState === "signup" ? (
        <SignupForm handler={handleSignup} />
      ) : (
        <OtpForm handler={confirmSignup} resendHandler={resendHandler} />
      )}
    </FormWrapper>
  );
};

export default Signup;