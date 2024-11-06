import { useEffect, useRef, useState } from "react";
import { RiDoubleQuotesL } from "react-icons/ri";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
const ProfileCard = () => {
  const dataRef = useRef([
    {
      description: `Lorem ipsum dolor sit amet consectetur. Elit libero et blandit
            nullam. Faucibus dignissim varius gravida auctor sit nisi
            scelerisque. Volutpat ut commodo amet id vulputate mattis lectus
            condimentum. Purus diam magna id vitae tristique elit elit
            tincidunt.`,
      image:
        "https://s3-alpha-sig.figma.com/img/a5d0/5c22/5aca60276e40abbf21fdb93a32767317?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DhfMN3GIujo4Pfe6Tewpny2YRTCBA8vS2I70SyahoQLiCNiVih1ZxHjuKlYEACWQZpT21TdkoJJ4hpBXPZYbZu1iFkU7Ogvj~a~9tKHocqxkwE1TkCtopuvL-zOREdqvfrh4SVL0PFIAg2cAt1wvVKAKYnAfEyJsXIKP2m7OQ4rc5m8vMe1vShvY9EulCoZ3~aRMK~YJibZpBn-wyBy8gmT5pGHvM1a0xQ4PFLCX6~CQ~M1F1RZ19a2ScuCpi4xYhLviRFyMXHfe8X5EQ7S4mJIoZxYZGe-ZLMiP3Cj-gZgYGndb8c3wXPmaosgZQQLU7iTnJfsL4WTnPFOHRv0FnQ__",
    },
    {
      description: `Lorem ipsum dolor sit amet consectetur. Elit libero et blandit
            nullam. Faucibus dignissim varius gravida auctor sit nisi
            scelerisque. Volutpat ut commodo amet id vulputate mattis lectus
            condimentum. Purus diam magna id vitae tristique elit elit
            tincidunt.`,
      image:
        "https://s3-alpha-sig.figma.com/img/8c8d/0578/99298f02b823f1747b27103f85f4fb0d?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=imHyG~z9kOM9Dhv~WSjT3dB3Cm0kE284EJp7KuzlQNEdZLoXz37v2~IP7jGKTu18ddpbm22rq0jNfazwE5oZrIl9UVbSCtfGRVUNSxMdSxvpJraHNIMEKdwcDRIdan45lh1cwfNapqHbQ2jv71v25P9ogB2V6djSvLUDa0IJPcNLyfZxX~JMhi6vzzcHv84-0t3L04yUe6IMe2m7jblCjwLZ~nAHQPYms9VhI6skdJOch1m8B4J4Nley~qo9jsVU5~xb~v~gRwv01l27s6bIPEAlXrG5bq8nKqv4YQDAiOf19xDAij3UgzekNcyOBnjRLQwmcqCp9Smn5npureNy8g__",
    },
    {
      description: `Lorem ipsum dolor sit amet consectetur. Elit libero et blandit
            nullam. Faucibus dignissim varius gravida auctor sit nisi
            scelerisque. Volutpat ut commodo amet id vulputate mattis lectus
            condimentum. Purus diam magna id vitae tristique elit elit
            tincidunt.`,
      image:
        "https://s3-alpha-sig.figma.com/img/f2a6/006d/420799b6ccf932344b02fff34005ad56?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dfpLYFjDqO2zaJYPSlMPc2YX6XotcyE5FX5NXwieuRMJd75Qj0ZSyTB-69oPKs3ZJsPL91vKLJirJGalJbhvnz6CByZr6g8iClv0PSzblQGb4vl0w3LljlTmnkiVqIQAvnxiCV-HITEp-46brxuK2rDEjTAQjixYIZQZKLQNTiqc9WRuBGvcJlhOvws--17WDbQxQDDbW776p2VPdrOzLE79koQ53LTGORjB-guY6GCdYmGJPcZ76wHOfJjdXWSZ5zp2jbm~zbsLNh6QliDiSlHoZH-EzOl8IAQup-3Ljl7wVNULZb3TyfD-c6TSdU~bcmFjjET93CWAbSmrqXbyHg__",
    },
    {
      description: `Lorem ipsum dolor sit amet consectetur. Elit libero et blandit
            nullam. Faucibus dignissim varius gravida auctor sit nisi
            scelerisque. Volutpat ut commodo amet id vulputate mattis lectus
            condimentum. Purus diam magna id vitae tristique elit elit
            tincidunt.`,
      image:
        "https://s3-alpha-sig.figma.com/img/24c2/22fc/9f8cad508eb3298a3d6b7dd3c8b6ced6?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gLDW6GtixJyAm2~H3-6e1nTf1V-h37OjfuGn5MOxYcXxe0VkOSiozcA4wG7J2Wjj665pswXQLj2dCwMpMJB6PbhnEwfjKQmGNh8uzJMamyoJaCjcMnPLpLdrM-xMKxD32rtdBcfcntwJlqs293bC-4TnA9HcYbVKcNj22c3FDIfE8LP9WVN2R2FcWqFaTKMeK8VkGhDMTwTxO6sni8et4l3aVhNv2eLncck4iTgbRVso3Y9WHkEvdHPGepURKcdhcYUYFBKK~IQl8IJ4iU-CGG09C8W3Am2FwkA1TxJ-lB0And1SE5778Un2V3w9xE515T8KQsVCE5odGT87VyqA9w__",
    },
  ]);
  const data = dataRef.current;
  const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [data.length]);
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  return (
    <div className="">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-center mt-8 text-[3rem] mb-4 text-lightPrimaryColor">
          Success Story
        </h1>
        <p className="text-[1rem] mt-2 text-center font-[600]">
          Say goodbye to interruptions and enjoy uninterrupted music streaming.
          With our ad-free platform, you’ll have access to millions of songs
        </p>
      </div>
      {/* <div className="w-[1033px] h-[570px] mx-auto">
        <div className="relative w-[962px] h-[570px] left-[73px]">
          <div className="relative w-[960px] h-[570px]">
            <div className="absolute w-[903px] h-[445px] top-[97px] left-0 bg-neutral-50 rounded-[21.77px] shadow-[0px_85.26px_181.4px_#15151526]" />

            <img
              className="absolute w-[381px] h-[570px] top-0 left-[487px] object-cover rounded-md"
              alt="Unsplash ww"
              src={data[currentIndex].image}
            />

            <div className="inline-flex flex-col items-start justify-end gap-[3.63px] absolute top-[442px] left-[67px]">
              <div className="mt-[-0.91px] [font-family:'Manrope-Medium',Helvetica] font-medium text-black text-[29px] relative w-fit tracking-[0] leading-[normal]">
                User Name
              </div>

              <div className="[font-family:'Manrope-Regular',Helvetica] font-normal text-[#808080] text-[12.7px] relative w-fit tracking-[0] leading-[normal]">
                user id
              </div>
            </div>

            <p className="absolute w-full max-w-[361px] top-[120px] lg:top-[141px] left-4 lg:left-[63px] [font-family:'Manrope-Regular',Helvetica] font-normal text-black text-[21.8px] tracking-[0] leading-[36.3px]">
              Lorem ipsum dolor sit amet consectetur. Elit libero et blandit
              nullam. Faucibus dignissim varius gravida auctor sit nisi
              scelerisque. Volutpat ut commodo amet id vulputate mattis lectus
              condimentum. Purus diam magna id vitae tristique elit elit
              tincidunt.
            </p>
            {currentIndex === data.length - 1 ? null : (
              <div className="flex w-[121px] items-center justify-center gap-[29.02px] px-[21.77px] py-[14.51px] absolute top-[423px] left-[839px] bg-secondary-black rounded-[21.77px]">
                <div
                  className="relative w-fit  rounded-md mt-[-0.91px] [font-family:'Manrope-SemiBold',Helvetica] font-semibold text-white text-[12.7px] tracking-[0] leading-[23.6px] whitespace-nowrap bg-black p-2 hover:cursor-pointer active:bg-slate-400"
                  onClick={handleNext}
                >
                  Next
                </div>

                <span className="!relative !w-[14.51px] !h-[14.51px]" />
              </div>
            )}
            {currentIndex === 0 ? null : (
              <div className="flex w-[121px] items-center justify-center gap-[29.02px] px-[21.77px] py-[14.51px] absolute top-[423px] right-[839px] bg-secondary-black rounded-[21.77px]">
                <div
                  className="relative w-fit  rounded-md mt-[-0.91px] [font-family:'Manrope-SemiBold',Helvetica] font-semibold text-white text-[12.7px] tracking-[0] leading-[23.6px] whitespace-nowrap bg-black p-2 hover:cursor-pointer active:bg-slate-400"
                  onClick={handlePrev}
                >
                  Prev
                </div>
                <span className="!relative !w-[14.51px] !h-[14.51px]" />
              </div>
            )}

            <RiDoubleQuotesL className="absolute hidden lg:block w-11 h-11 top-[122px] left-[17px]" />
          </div>
        </div> 
      </div>*/}
      <div className="max-w-[1033px] h-auto lg:h-[570px] mx-auto p-4 lg:p-0">
        <div className="relative mx-auto lg:flex lg:space-x-6 lg:h-full">
          {/* Left Content - Main Container */}
          <div className="bg-neutral-50 rounded-[21.77px] shadow-[0px_85.26px_181.4px_rgba(21,21,21,0.15)] lg:w-[903px] h-auto lg:h-[445px] flex flex-col justify-center p-6 lg:pt-[97px] lg:px-8 space-y-6 lg:space-y-0 lg:relative">
            {/* Quote Icon */}
            <RiDoubleQuotesL className="hidden lg:block text-gray-400 w-11 h-11 absolute top-6 left-6" />

            {/* Paragraph Content */}
            <p className="text-[21.8px] leading-[1.75] lg:leading-[36.3px] text-black [font-family:'Manrope-Regular',Helvetica] max-w-[361px] mx-auto lg:mx-0 lg:mt-6">
              Lorem ipsum dolor sit amet consectetur. Elit libero et blandit
              nullam. Faucibus dignissim varius gravida auctor sit nisi
              scelerisque. Volutpat ut commodo amet id vulputate mattis lectus
              condimentum. Purus diam magna id vitae tristique elit elit
              tincidunt.
            </p>

            {/* User Name and ID */}
            <div className="flex flex-col items-start space-y-1 lg:absolute lg:bottom-6 lg:left-8">
              <div className="text-[29px] font-medium text-black [font-family:'Manrope-Medium',Helvetica]">
                User Name
              </div>
              <div className="text-[12.7px] text-[#808080] [font-family:'Manrope-Regular',Helvetica]">
                user id
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full mt-6 lg:absolute lg:top-[423px] lg:left-8 lg:space-x-4">
              {currentIndex > 0 && (
                <button
                  className=" relative right-11 px-4 py-2 bg-black text-white text-[12.7px] font-semibold rounded-2xl [font-family:'Manrope-SemiBold',Helvetica] hover:bg-slate-600 active:bg-slate-400"
                  onClick={handlePrev}
                >
                  <span className="flex justify-between items-center space-x-3 lg:text-lg ">
                    <GrFormPrevious />
                    Prev
                  </span>
                </button>
              )}
              {/* Mobile view next button */}
              {currentIndex < data.length - 1 && (
                <button
                  className={`lg:hidden relative ${
                    currentIndex === 0 ? "left-[calc(100%-31px)]" : "-right-11"
                  } block px-4 py-2 bg-black text-white text-[12.7px] font-semibold rounded-2xl [font-family:'Manrope-SemiBold',Helvetica] hover:bg-slate-600 active:bg-slate-400`}
                  onClick={handleNext}
                >
                  <span className="flex justify-between items-center space-x-3 lg:text-lg ">
                    Next
                    <MdNavigateNext />
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="mt-6 lg:mt-0 lg:w-[600px] h-[570px]">
            <img
              className="w-full h-full object-cover rounded-md"
              alt="User"
              src={data[currentIndex].image}
            />
            {/* Larger Svreen next button on image */}
            {currentIndex < data.length - 1 && (
              <button
                className="hidden lg:block relative bottom-36 left-80 px-4 py-2 bg-black text-white text-[12.7px] font-semibold rounded-2xl [font-family:'Manrope-SemiBold',Helvetica] hover:bg-slate-600 active:bg-slate-400"
                onClick={handleNext}
              >
                <span className="flex justify-between items-center space-x-3 lg:text-lg ">
                  Next
                  <MdNavigateNext />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;







