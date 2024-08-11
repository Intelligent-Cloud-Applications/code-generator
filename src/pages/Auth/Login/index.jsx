// Packages


// Local
import Header from "../../../components/Header";
import LoginForm from "./LoginForm";
import OtpForm from './OtpForm';
import {useState} from "react";


// Code
const Login = () => {
  const [ signinResponse, setSigninResponse ] = useState();

  return (
    <div>
      <Header />
      <div className='flex flex-col items-center mt-10'>
        <div
          className={
            `flex flex-col items-center gap-4
            shadow-xl px-20 py-12 w-[480px] rounded-xl`
          }
        >
          <h2 className='font-bold text-2xl'>Login</h2>
          <p className='text-center w-full'>Hey, Enter your details to sign in to your account</p>
          { signinResponse ?
            <OtpForm signinResponse={signinResponse} setSigninResponse={setSigninResponse} /> :
            <LoginForm setSigninResponse={setSigninResponse} />
          }
        </div>
      </div>
    </div>
  )
}

export default Login;