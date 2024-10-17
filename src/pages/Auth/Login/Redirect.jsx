import {useContext, useEffect} from "react";
import {API, Auth} from "aws-amplify";
import {toast} from "react-toastify";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import {useNavigate} from "react-router-dom";

const Redirect = () => {
  const { util, setUserData, setIsAuth, onAuthLoad } = useContext(Context);
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      util.setLoader(true);
      try {
        await Auth.currentAuthenticatedUser();

        const userdata = await API.get(
          'main',
          `/user/profile/${InstitutionId}`,
          {}
        );
        setUserData(userdata);
        setIsAuth(true);

        toast.info('Logged in');
        onAuthLoad(true, InstitutionId);
        util.setLoader(false);
        navigate('/dashboard');
      } catch (e) {
        toast.error('Please signup first');
        util.setLoader(false);
        navigate('/signup');
      }
    }

    redirect();
  }, []);
}

export default Redirect;