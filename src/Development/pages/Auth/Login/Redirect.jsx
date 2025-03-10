import { useContext, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { toast } from "react-toastify";
import Context from "../../../Context/Context";
import InstitutionContext from "../../../Context/InstitutionContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Redirect = () => {
  const { util, setUserData, setIsAuth, onAuthLoad } = useContext(Context);
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  useEffect(() => {
    const redirect = async () => {
      util.setLoader(true);
      try {
        const cognito = await Auth.currentAuthenticatedUser();
        const attributes = await jwtDecode(cognito.signInUserSession.idToken.jwtToken);

        const response = await API.post(
          "main",
          `/any/user-exists/${InstitutionId}`,
          {
            body: {
              userPoolId: cognito.pool.userPoolId,
              username: attributes.email,
            }
          }
        );

        if (!response.inInstitution) {
          await API.post(
            "main",
            `/user/profile/${InstitutionId}`,
            {
              body: {
                userName: attributes.name,
                emailId: attributes.email,
              },
            }
          );
        }

        const userdata = await API.get("main", `/user/profile/${InstitutionId}`, {});
        setUserData(userdata);
        setIsAuth(true);

        toast.info("Logged in");
        onAuthLoad(true, InstitutionId);
        util.setLoader(false);

        // Redirect based on productId presence
        if (productId) {
          window.location.href = `https://betapayment.happyprancer.com/${InstitutionId}/${productId}/${userdata.cognitoId}`;
        } else {
          const path = window.sessionStorage.getItem("login_redirect");
          window.sessionStorage.removeItem("login_redirect");
          if (userdata.phoneNumber) navigate(path || "/dashboard");
          else navigate("/phone-update");
        }
      } catch (e) {
        toast.error("Please signup first");
        util.setLoader(false);
        navigate("/signup");
      }
    };

    redirect();
  }, []);

  return null;
};

export default Redirect;
