import { useContext } from "react";
import { Auth, API } from "aws-amplify";
import InstitutionContext from "../../../Context/InstitutionContext";
import { toast } from "react-toastify";
import Context from "../../../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { HR } from "flowbite-react";
import {
  EmailInput,
  PasswordInput,
  PrimaryButton,
} from "../../../common/Inputs";
import { FormWrapper } from "../../../common/Layouts";

const customTheme = {
  hrLine: "my-4 h-px w-64 border-0 bg-gray-700 dark:bg-gray-200",
};

const AuthPage = () => {
  const { setLoader } = useContext(Context).util;
  const data = useContext(InstitutionContext).institutionData;
  const { InstitutionId, productId } =
    useContext(InstitutionContext).institutionData;
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.toLowerCase();

    setLoader(true);
    try {
      const exists = await API.post(
        "main",
        `/any/user-exists/${InstitutionId}`,
        {
          body: {
            userPoolId:
              process.env.REACT_APP_STAGE === "PROD"
                ? process.env.REACT_APP_PROD_USER_POOL_ID
                : process.env.REACT_APP_DEV_USER_POOL_ID,
            username: email,
          },
        }
      );

      if (exists.inCognito && exists.inDynamoDb && exists.inInstitution) {
        await Auth.signIn(email, event.target.password.value);
        setLoader(false);
        navigate("/redirect");
      } else {
        setLoader(false);
        toast.error("Account does not exist");
        navigate("/signup");
      }
    } catch (e) {
      console.log(e);
      if (e.name === "NotAuthorizedException")
        toast.error("Incorrect password");
      else toast.error("Unknown error occurred");
    } finally {
      setLoader(false);
    }
  };

  return (
    <FormWrapper heading="Login">
      {/* Background Blur Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left blob */}
        <div
          className="absolute w-[15rem] h-[15rem] -left-8 top-1/3 opacity-30 blur-3xl rounded-full z-[-1]"
          style={{ backgroundColor: data.PrimaryColor }}
        ></div>

        {/* Right blob */}
        <div
          className="absolute w-[18rem] h-[18rem] -right-10 top-1/4 opacity-25 blur-3xl rounded-full z-[-1]"
          style={{ backgroundColor: data.PrimaryColor }}
        ></div>

        {/* Top blob */}
        <div
          className="absolute w-[12rem] h-[12rem] top-0 left-1/3 opacity-20 blur-3xl rounded-full z-[-1]"
          style={{ backgroundColor: data.PrimaryColor }}
        ></div>

        {/* Bottom blob */}
        <div
          className="absolute w-[14rem] h-[14rem] -bottom-10 right-1/4 opacity-30 blur-3xl rounded-full z-[-1]"
          style={{ backgroundColor: data.PrimaryColor }}
        ></div>
      </div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center gap-3 w-full max-w-md"
      >
        {productId === "1000007" && (
          <>
            <button
              className="flex items-center bg-white w-full justify-center text-black px-4 py-2 border rounded-md"
              type="button"
              onClick={() =>
                Auth.federatedSignIn({
                  provider: CognitoHostedUIIdentityProvider.Google,
                })
              }
            >
              <img
                className="w-6 h-6 mr-2"
                src="https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png"
                alt="Google Icon"
              />
              Sign in with Google
            </button>
            <HR.Text text="or" theme={customTheme} />
          </>
        )}
        <EmailInput name="email" className="rounded w-full" />
        <PasswordInput name="password" className="rounded w-full" />
        <Link to={"/forgot-password"}>Forgot password?</Link>
        <PrimaryButton className="hover:opacity-[90%]">Continue</PrimaryButton>
        {productId === "1000007" && (
          <p>
            Dont have an account? <Link to={"/signup"}>Signup</Link>
          </p>
        )}
      </form>
    </FormWrapper>
  );
};

export default AuthPage;
