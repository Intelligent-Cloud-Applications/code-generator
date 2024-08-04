
import React, { useContext, useEffect, useState } from 'react';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import './Testimonial.css';
import InstitutionContext from '../../../Context/InstitutionContext';

const Testimonial = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const testiData = InstitutionData.Testimonial.map((val) => ({
    name: val.name,
    description: val.description,
    src: val.img,
  }));

  const [testimonials, setTestimonials] = useState(testiData);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01 } // Adjust threshold as needed
    );

    // Observe the element
    const element = document.getElementById('testimonial-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const leftClicked = () => {
    setTestimonials((testi) => {
      const tempTesti = [...testi];
      const firstTesti = tempTesti.pop();
      tempTesti.unshift(firstTesti);
      return tempTesti;
    });
  };

  const rightClicked = () => {
    setTestimonials((testi) => {
      const tempTesti = [...testi];
      const lastTesti = tempTesti.shift();
      tempTesti.push(lastTesti);
      return tempTesti;
    });
  };

  return (
    <div
      id="testimonial-section"
      className={`sans-sarif max500:h-[22rem] max700:h-[58rem] size h-[50rem]`}
    >
      <div
        className={`Test-size py-[0.2rem] flex flex-col item-center bg-black`}
        style={{
          backgroundImage: inView ? `url(${InstitutionData.TestimonialBg})` : 'none',
          backgroundSize: 'cover',
        }}
      >
        <h1
          className={`Test-text m-8 text-white-250 max478:text-white-[4rem] font-bold`}
        >
          TESTIMONIAL
        </h1>
        <div className={``}>
          <div className={``}>
            <ul className={`feedback`}>
              <div className={`absolute w-screen flex justify-center flex-col min-h-[25rem]`}></div>
              {testimonials.map((test, i) => (
                <li key={i}>
                  {inView && (
                    <img
                      src={test.src}
                      alt=""
                      className={`ecllip${i + 2}`}
                      loading="lazy" // Lazy load images
                    />
                  )}
                </li>
              ))}
              <BsArrowLeftCircle
                color="white"
                size={'2rem'}
                className={`absolute left-16 cursor-pointer max536:left-6 max500:left-2 max406:h-[1.5rem]`}
                onClick={leftClicked}
              />
              <BsArrowRightCircle
                color="white"
                size={'2rem'}
                className={`absolute right-16 cursor-pointer max536:right-6 max500:right-2 max406:h-[1.5rem]`}
                onClick={rightClicked}
              />
            </ul>
          </div>
          {testimonials[1] && (
            <>
              <h1
                className={`mona h-[4.5rem] w-[100%] font-[500] `}
                style={{ fontSize: '1.8rem' }}
              >
                {testimonials[1].name}
              </h1>
              <div className={`flex relative z-2 object-cover justify-center max1050:pl-8 max1050:pr-8`}>
                <h2
                  className={`text-[1rem] z-2 pt-4 w-[50rem] max478:text-[0.75rem] text-center font-sans text-white`}
                  style={{
                    letterSpacing: '1.6px',
                  }}
                >
                  <span className={`text-[1.4rem]`}>"</span>
                  {testimonials[1].description}
                  <span className={`text-[1.4rem]`}>"</span>
                </h2>
              </div>
            </>
          )}
          <div className={`flex justify-center item-center mt-1`}>
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
                className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] max406:h-[1rem]`}
                alt=""
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;







// // import { useSelector } from "react-redux";
// import { Carousel } from "flowbite-react";
// import {useContext} from "react";
// import institutionContext from "../../../Context/InstitutionContext";

// const Testimonials = () => {
//   // const { Testimonial } = useSelector((state) => state.institutionData.data);
//   const { Testimonial } = useContext(institutionContext).institutionData;
  
//   return (
//     <div className="h-screen bg-black flex flex-col gap-6 justify-center items-center">
//       <h2 className="text-3xl font-bold text-center text-[2.5rem] text-white">
//         Testimonials
//       </h2>
//       <div className="h-[80vh] sm:h-64 xl:h-[80vh] 2xl:h-[80vh] w-[90vw]">
//         <Carousel>
//           {Testimonial?.map((testimonial, index) => (
//             <div
//               key={index}
//               className="flex flex-col gap-4 items-center justify-center w-[70vw]"
//             >
//               <img
//                 src={testimonial.img}
//                 alt={testimonial.name}
//                 className="w-40 h-40 rounded-full object-cover"
//               />
//               <p className="text-white text-center text-[2rem] font-semibold">
//                 {testimonial.name}
//               </p>
//               <p className="text-white text-center w-[50vw] font-semibold">
//                 {testimonial.description}
//               </p>
//               <div className="flex flex-row gap-2">
//                 <img
//                   src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
//                   className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
//                   alt=""
//                 />
//                 <img
//                   src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
//                   className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
//                   alt=""
//                 />
//                 <img
//                   src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
//                   className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
//                   alt=""
//                 />
//                 <img
//                   src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
//                   className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
//                   alt=""
//                 />
//                 <img
//                   src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/yellow star.png`}
//                   className={`h-[1.8rem] mt-[0.5rem] max800:mt-[0.3rem] max800:h-[1.5rem] `}
//                   alt=""
//                 />
//               </div>
//             </div>
//           ))}
//         </Carousel>
//       </div>
//     </div>
//   );
// };

// export default Testimonials;
