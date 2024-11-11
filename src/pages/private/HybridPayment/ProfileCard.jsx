import { useRef, useState } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { RiDoubleQuotesL } from "react-icons/ri";
import "./SubscriptionCard.css";
const ProfileCard = () => {
  const dataRef = useRef([
    {
      description: `Online training provides a great alternative to traditional gyms, especially for beginners. Dance makes workouts fun and expressive, and HappyPrancers delivers an outstanding experience with skilled, motivating trainers. Suitable for all levels, it’s been a fantastic journey—thank you, HappyPrancers!`,
      image:
        "https://institution-utils.s3.amazonaws.com/happyprancer/images/Testimonial/2.png",
      name: "John Doe",
    },
    {
      description: `Joining in this Live session ....I have learnt to spend time with myself and relative my stress in a fraction of minute.. delighted to be a part of this class...`,
      image:
        "https://institution-utils.s3.amazonaws.com/happyprancer/images/Testimonial/3.jpg",
      name: "Jane Doe",
    },
    {
      description: `Joining in this Live session ....I have learnt to spend time with myself and relative my stress in a fraction of minute.. delighted to be a part of this class..`,
      image:
        "https://institution-utils.s3.amazonaws.com/happyprancer/images/Testimonial/1.png",
      name: "John Doe",
    },
    
  ]);
  const data = dataRef.current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };
  const handlePrev = () => {
    console.log("prev");
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="hybrid-heading text-3xl font-bold text-center mt-8 text-[3rem] mb-4 text-lightPrimaryColor">
          Success Story
        </h1>
        <p className="text-[1rem] mt-2 px-4 w-2/3 mx-auto text-center font-[600]">
          From humble beginnings to remarkable achievements, our success story
          is a testament to passion, perseverance, and the power of believing in
          dreams.
        </p>
      </div>

      <div className="my-32 w-[287px] md:w-11/12 md:max-w-[980px] mx-auto md:h-[450px] h-[333px]">
        <div className="w-[287px] md:w-full -left-1 relative h-full">
          <div className="relative md:w-full w-[284px]">
            <svg
              className="absolute z-0 -top-[34rem] opacity-70 -left-[56rem]"
              xmlns="http://www.w3.org/2000/svg"
              width="952"
              height="1154"
              viewBox="0 0 952 1154"
              fill="none"
            >
              <g filter="url(#filter0_f_34_248)">
                <path
                  d="M-271.203 764.711C-373.796 603.674 -303.701 389.035 -125.837 319.589L138.941 216.207C317.459 146.505 518.681 234.717 588.383 413.235L736.048 791.429C805.75 969.947 717.538 1171.17 539.02 1240.87L210.984 1368.95C58.07 1428.66 -113.806 1349.15 -167.306 1193.95L-169.109 1188.72C-175.258 1170.89 -183.472 1153.83 -193.585 1137.9L-208.093 1115.05C-235.326 1072.17 -243.231 1019.79 -229.869 970.774C-226.216 957.372 -224.122 943.594 -223.627 929.712L-223.342 921.725C-221.543 871.215 -235.12 821.349 -262.276 778.723L-271.203 764.711Z"
                  fill="url(#paint0_angular_34_248)"
                />
              </g>
              <defs>
                <filter
                  id="filter0_f_34_248"
                  x="-510.778"
                  y="0.348511"
                  width="1462.68"
                  height="1580.49"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="96"
                    result="effect1_foregroundBlur_34_248"
                  />
                </filter>
                <radialGradient
                  id="paint0_angular_34_248"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(196.459 784.186) rotate(16.8193) scale(691.439 508.599)"
                >
                  <stop offset="0.146" stop-color="white" stop-opacity="0" />
                  <stop offset="0.506955" stop-color="#225C59" />
                  <stop offset="1" stop-color="white" stop-opacity="0.53" />
                </radialGradient>
              </defs>
            </svg>
            <div className="absolute w-[310px] md:w-full md:h-[27rem] h-[330px] top-0 left-0 bg-neutral-50 rounded-[21.77px] shadow-[0px_85.26px_181.4px_#15151526]" />

            <RiDoubleQuotesL className="relative text-8xl text-slate-500 bottom-8 -left-4 h-12 w-16" />
            <img
              className="absolute w-[3.188rem] h-[5.78rem] md:h-[35rem] md:w-[23rem] md:right-12 md:-top-28 -top-8 right-0 object-cover rounded-md"
              alt="Unsplash ww"
              src={data[currentIndex].image}
            />

            <div className="inline-flex flex-col items-start justify-end gap-[3.63px] absolute -bottom-14 left-4">
              <div className="mt-[-0.91px] [font-family:'Manrope-Medium',Helvetica] font-medium text-black text-[29px] relative w-fit tracking-[0] leading-[normal]">
                {data[currentIndex].name || "User Name"}
              </div>

              <div className="[font-family:'Manrope-Regular',Helvetica] font-normal text-[#808080] text-[12.7px] relative w-fit tracking-[0] leading-[normal]">
                user id
              </div>
            </div>

            <p className="absolute w-full  max-w-[361px] md:max950:max-w-[220px] top-28 left-4  [font-family:'Manrope-Regular',Helvetica] font-normal text-black md:first-letter:text-3xl md:tracking-wide">
              {data[currentIndex].description}
            </p>
          </div>
        </div>
        <div className="flex min-w-[300px]  mx-auto justify-between items-center mt-2 md:-top-32 md:relative md:max950:-top-20">
          {currentIndex !== 0 && (
            <div>
              <div
                className="custom-button cursor-pointer text-white rounded-md p-2"
                onClick={handlePrev}
              >
                <div className="flex justify-center space-x-3 items-center">
                  <GrFormPrevious />
                  <p>Prev</p>
                </div>
              </div>
              <span className="!relative !w-[14.51px] !h-[14.51px]" />
            </div>
          )}

          {currentIndex !== data.length - 1 && (
            <div className="ml-auto">
              <div
                className="custom-button cursor-pointer text-white rounded-md p-2"
                onClick={handleNext}
              >
                <div className="flex justify-center space-x-3 items-center">
                  <p>Next</p>
                  <MdNavigateNext />
                </div>
              </div>
              <span className="!relative !w-[14.51px] !h-[14.51px]" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
