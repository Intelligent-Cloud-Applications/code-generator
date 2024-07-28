// import { useSelector } from "react-redux";
import { Carousel } from "flowbite-react";
import {useContext} from "react";
import institutionContext from "../../../Context/InstitutionContext";

const Testimonials = () => {
  // const { Testimonial } = useSelector((state) => state.institutionData.data);
  const { Testimonial } = useContext(institutionContext).institutionData;
  
  return (
    <div className="h-screen bg-black flex flex-col gap-6 justify-center items-center">
      <h2 className="text-3xl font-bold text-center text-[2.5rem] text-white">
        Testimonials
      </h2>
      <div className="h-[80vh] sm:h-64 xl:h-[80vh] 2xl:h-[80vh] w-[90vw]">
        <Carousel>
          {Testimonial?.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 items-center justify-center w-[70vw]"
            >
              <img
                src={testimonial.img}
                alt={testimonial.name}
                className="w-40 h-40 rounded-full object-cover"
              />
              <p className="text-white text-center text-[2rem] font-semibold">
                {testimonial.name}
              </p>
              <p className="text-white text-center w-[50vw] font-semibold">
                {testimonial.description}
              </p>
              <div className="flex flex-row gap-2">
                <img
                  src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
                  className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
                  alt=""
                />
                <img
                  src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
                  className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
                  alt=""
                />
                <img
                  src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
                  className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
                  alt=""
                />
                <img
                  src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
                  className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
                  alt=""
                />
                <img
                  src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
                  className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
                  alt=""
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonials;
