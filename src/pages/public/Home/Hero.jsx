// Packages
//import { useSelector } from "react-redux";
import {useContext} from "react";

// Context
import institutionContext from "../../../Context/InstitutionContext";


// Code
const Hero = () => {
//  const { TagLine, videoUrl } = useSelector((state) => console.log(state) || state.institutionData.data);
  const { TagLine, videoUrl } = useContext(institutionContext).institutionData;
  const defaultSubText =
    'Online Live & In-person Bollywood Dance & Yoga Sessions at Affordable Price';
  
  return (
    <div
      className={
        `flex flex-col gap-2 items-center justify-center
        w-full h-[500px] relative bg-black`
      }
      style={{ backgroundImage: videoUrl ? `url(${ videoUrl })` : undefined }}
    >
      <video
        autoPlay loop muted disablePictureInPicture controls={false}
        src={ videoUrl }
        className='w-[100%] h-full object-cover object-center absolute z-0'
      />
      <h1 className='text-8xl text-white z-10'>{ TagLine }</h1>
      <h2 className='text-3xl text-white font-light italic z-10'>{ defaultSubText }</h2>
    </div>
  )
}

export default Hero;