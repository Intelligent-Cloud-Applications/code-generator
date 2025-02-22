import {
  CountrySelect,
  PhoneInput, PrimaryButton
} from "../../../common/Inputs";
import countries from "../../../common/Inputs/countries.json";
import {useContext} from "react";
import Context from "../../../Context/Context";
import {API} from "aws-amplify";
import InstitutionContext from "../../../Context/InstitutionContext";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const PhoneUpdate = () => {
  const { InstitutionId } = useContext(InstitutionContext).institutionData;
  const { userData, setUserData, util } = useContext(Context);
  const navigate = useNavigate();

  const handler = async (event) => {
    event.preventDefault();

    let countryName = '';
    for (let country of countries) {
      if (country.value === event.target.country.value) {
        countryName = country.name.split(' (')[0];
        break;
      }
    }
    const phoneNumber = `+${event.target.country.value}${event.target.phone.value}`;

    util.setLoader(true);
    try {
      const updatedData = await API.put(
        'main',
        `/user/profile/${InstitutionId}`,
        {
          body: { ...userData, phoneNumber, country: countryName },
        },
      );

      setUserData(updatedData.Attributes);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      util.setLoader(false);
    }
  }

  return (
    <div className='p-8 pt-16 flex flex-col items-center gap-2'>
      <h1 className='font-bold text-2xl'>Add Phone Number</h1>
      <p>It seems we couldn't find your phone number. Please add it to continue using our services.</p>
      <form
        onSubmit={handler}
        className={
          `flex flex-col items-center gap-6
          w-80 pt-8`
        }
      >
        <CountrySelect name='country' className='rounded w-full'/>
        <PhoneInput name='phone' className='rounded w-full'/>
        <PrimaryButton>Continue</PrimaryButton>
      </form>
    </div>
  )
}

export default PhoneUpdate;