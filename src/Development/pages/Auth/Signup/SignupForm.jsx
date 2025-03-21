import {
  BaseTextInput,
  CountrySelect,
  EmailInput,
  PasswordInput,
  PhoneInput,
  PrimaryButton,
  BaseTextInputWithValue,
  BaseTextInputWithValue,
} from "../../../common/Inputs";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import InstitutionContext from "../../../Context/InstitutionContext";
// import institutionData from "../../../constants";

const SignupForm = ({ handler }) => {
  const data = useContext(InstitutionContext).institutionData;
  console.log("data", data.PrimaryColor);
  const [referral_code, setReferralCode] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [name, setName] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral = params?.get("referral");
    const referral = params?.get("referral");
    if (referral) {
      setReferralCode(referral);
    }
  }, [location.search]);

  return (
    <>
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
      {/* Glass effect container */}
      <div className=" w-full max-w-md m-auto  p-6 bg-transparent rounded-xl relative z-10 ">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Your Account
          </h2>
          <p className="text-gray-600">Join our community and get started</p>
        </div>

        {/* Sign up options */}
        {!showManualForm ? (
          <div className="flex flex-col w-full gap-3 max-w-md mx-auto">
            <button
              className="flex items-center justify-center text-gray-800 px-5 py-2 border border-gray-300 rounded-lg
                      shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 w-full font-medium"
              type="button"
              onClick={() =>
                Auth.federatedSignIn({
                  provider: CognitoHostedUIIdentityProvider.Google,
                })
              }
            >
              <img
                className="w-5 h-5 mr-3"
                src="https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png"
                alt="Google Icon"
              />
              Continue with Google
            </button>

            <div className="flex items-center w-full my-1">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <PrimaryButton
              className="w-full transition-all text-base py-2 rounded-lg font-medium hover:opacity-90"
              onClick={() => setShowManualForm(true)}
            >
              Sign up with email
            </PrimaryButton>

            <p className="text-xs text-gray-500 text-center mt-2">
              By creating an account, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handler} className="transition-all">
            <button
              className="absolute top-1 left-1 hover:opacity-[90%] w-full md:w-1/3 text-sm sm:text-base order-2 md:order-1"
              onClick={() => setShowManualForm(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <div className="grid gap-x-6 gap-y-4">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Information
                  </label>
                  <BaseTextInput
                    name="name"
                    className="rounded w-full text-sm sm:text-base mb-2"
                    placeholder="Full Name"
                    pattern="[A-Za-z\ ]"
                    value={name}
                    onChange={(e) => {
                      if (/^[^0-9]*$/.test(e.target.value))
                        setName(e.target.value);
                    }}
                  />
                  <EmailInput
                    name="email"
                    className="rounded w-full text-sm sm:text-base mb-2"
                    placeholder="Email Address"
                  />
                  <div className="flex gap-2 items-center">
                    <CountrySelect
                      name="country"
                      className="rounded w-1/3 text-sm sm:text-base"
                    />
                    <PhoneInput
                      name="phone"
                      className="rounded w-2/3 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Security
                    </label>
                    <PasswordInput
                      name="password"
                      className="rounded w-full text-sm sm:text-base"
                      placeholder="Create Password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  {referral_code ? (
                    <BaseTextInputWithValue
                      name="referral"
                      className="rounded w-full text-sm sm:text-base"
                      value={referral_code}
                      required={false}
                    />
                  ) : (
                    <BaseTextInput
                      name="referral"
                      className="rounded w-full text-sm sm:text-base"
                      placeholder="Referral Code (optional)"
                      required={false}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Form actions */}
            <PrimaryButton
              className=" mt-4 hover:opacity-[90%] w-full md:w-2/3 text-sm sm:text-base order-1 md:order-2"
              type="submit"
            >
              Create Account
            </PrimaryButton>
          </form>
        )}
      </div>
    </>
  );
};

export default SignupForm;
