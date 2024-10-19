import {
  BaseTextInput,
  CountrySelect,
  EmailInput,
  PasswordInput,
  PhoneInput,
  PrimaryButton
} from "../../../common/Inputs";

const SignupForm = ({ handler }) => {
  return (
    <form
      onSubmit={handler}
      className={
        `flex flex-col items-center gap-6
        w-full`
      }
    >
      <BaseTextInput name='name' className='rounded w-full' placeholder='Name'/>
      <EmailInput name='email' className='rounded w-full'/>
      <CountrySelect name='country' className='rounded w-full'/>
      <PhoneInput name='phone' className='rounded w-full'/>
      <PasswordInput name='password' className='rounded w-full'/>
      <PasswordInput name='password_confirmation' className='rounded w-full' placeholder='Confirm Password'/>
      <BaseTextInput name='referral' className='rounded w-full' placeholder='Referral Code (optional)'
                     required={false}/>
      <PrimaryButton>Continue</PrimaryButton>
    </form>
  )
}

export default SignupForm;