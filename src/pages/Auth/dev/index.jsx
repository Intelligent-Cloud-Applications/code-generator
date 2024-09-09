import {useContext, useState} from "react";
import {Select} from "flowbite-react";
import {PrimaryButton} from "../../../common/Inputs";
import {API, Auth} from "aws-amplify";
import {toast} from "react-toastify";
import Context from "../../../Context/Context";
import institutionContext from "../../../Context/InstitutionContext";
import {useNavigate} from "react-router-dom";
import Header from "../../../components/Header";

const devAuth = () => {
  const options = [
    { userType: 'admin', email: 'admin@tester.com' },
    { userType: 'instructor', email: 'instructor@tester.com' },
    { userType: 'user', email: 'user@tester.com' },
  ]

  const { util, setUserData, setIsAuth, onAuthLoad } = useContext(Context);
  const { InstitutionId } = useContext(institutionContext).institutionData;
  const [email, setEmail] = useState(options[0].email);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    util.setLoader(true);
    try {
      await Auth.signIn(email, 'Password@123');

      const userdata = await API.get(
        'main',
        `/user/profile/${InstitutionId}`,
        {}
      );
      setUserData(userdata);
      setIsAuth(true);
      util.setLoader(false);

      toast.info('Logged in');
      onAuthLoad(true, InstitutionId);
      navigate('/dashboard');
    } catch (e) {
      console.log(e);
      toast.error('Unknown error occurred');
    } finally {
      util.setLoader(false);
    }
  }

  return (
    <div>
      <Header />
      <div className='w-80 mt-8 mx-auto flex flex-col gap-4'>
        <p>Login as: </p>
        <Select
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        >
          {options.map((option, index) => (
            <option key={index} value={option.email}>{option.userType}</option>
          ))}
        </Select>
        <PrimaryButton onClick={handleLogin}> Login </PrimaryButton>
      </div>
    </div>
  )
}

export default devAuth;