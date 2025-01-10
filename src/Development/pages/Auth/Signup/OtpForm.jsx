import {
  OtpInput,
  PrimaryButton
} from "../../../common/Inputs";
import {useState, useEffect} from "react";

const OtpForm = ({ handler, resendHandler }) => {
  const [seconds, setSeconds] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);

  const reset = () => {
    setIsDisabled(true);
    setSeconds(30);
  };

  const handleResend = () => {
    reset();
    resendHandler();
  }

  useEffect(() => {
    let interval = null;
    if (isDisabled && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsDisabled(false); // Re-enable the button when countdown reaches 0
      clearInterval(interval); // Clear the interval
    }
    return () => clearInterval(interval);
  }, [seconds, isDisabled]);

  return (
    <form
      onSubmit={handler}
      className={
        `flex flex-col items-center gap-6
        w-full`
      }
    >
      <OtpInput name='otp' className='rounded w-full'/>
      <button type="button" onClick={handleResend} disabled={isDisabled} className='text-blue-500'>
        {isDisabled ? `Resend OTP in ${seconds}s` : 'Resend OTP'}
      </button>
      <PrimaryButton>Continue</PrimaryButton>
    </form>
  )
}

export default OtpForm;