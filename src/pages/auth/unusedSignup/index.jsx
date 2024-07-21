// Packages


// Local
import Header from "../../../components/Header";
import {useState} from "react";
import SignupForm from "./SignupForm";


// Code
const Signup = () => {
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
          <h2 className='font-bold text-2xl'>Signup</h2>
          <p className='text-center w-56'>Unlock your Potential, Signup today for a healthier tomorrow!</p>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}

export default Signup;