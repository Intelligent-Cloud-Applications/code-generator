import { useRef, useState } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import "./SubscriptionCard.css";
const Testemonial = () => {
  const dataRef = useRef([
    {
      description: `Online training provides a great alternative to traditional gyms, especially for beginners. Dance makes workouts fun and expressive, and HappyPrancers delivers an outstanding experience with skilled, motivating trainers. Suitable for all levels, it’s been a fantastic journey—thank you, HappyPrancers!`,
      image:
        "https://institution-utils.s3.amazonaws.com/happyprancer/images/Testimonial/2.png",
      name: "Bapuji Mallik",
    },
    {
      description: `Joining in this Live session ....I have learnt to spend time with myself and relative my stress in a fraction of minute.. delighted to be a part of this class...`,
      image:
        "https://institution-utils.s3.amazonaws.com/happyprancer/images/Testimonial/3.jpg",
      name: "Priyanka Biswal",
    },
    {
      description: `Joining in this Live session ....I have learnt to spend time with myself and relative my stress in a fraction of minute.. delighted to be a part of this class..`,
      image:
        "https://institution-utils.s3.amazonaws.com/happyprancer/images/Testimonial/1.png",
      name: "Monalisha Sahoo",
    },
  ]);
  const data = dataRef.current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };
  const handlePrev = () => {
    // console.log("prev");
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

<div className="bg-gradient-to-b from-white to-gray-50 shadow-xl rounded-2xl p-8 h-auto overflow-hidden w-[90%] md:w-3/4 lg:w-1/3 min-w-[90%] md:min-w-[36rem] lg:min-w-[46rem] mx-auto mt-10 border border-gray-200 min-h-[366px] relative">
  <div className="grid grid-cols-1 gap-6 lg:gap-10 items-start">
    {/* Text Content */}
    <div>
      <div className="mb-6 flex items-center justify-between space-x-4">
        <p className="text-3xl font-extrabold text-gray-900 md:text-4xl leading-tight">
          {data[currentIndex].name}
        </p>
        {/* Image Content */}
        <div>
          <img
            src={data[currentIndex].image}
            alt={data[currentIndex].name}
            className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] object-cover rounded-full shadow-lg"
          />
        </div>
      </div>
      <p className="text-gray-700 text-base md:text-lg italic break-words leading-relaxed overflow-scroll h-44 md:h-full box-border">
        {data[currentIndex].description || "No bio available."}
      </p>
    </div>
  </div>

  {/* Navigation Buttons */}
  <div className="flex min-w-[300px] justify-between items-center mt-6 absolute bottom-2 md:bottom-6 left-8 right-8">
    {currentIndex !== 0 && (
      <button
        className="custom-button bg-primaryColor text-white px-4 py-2 rounded-md shadow-md hover:bg-lightPrimaryColor transition duration-200 flex items-center space-x-2"
        onClick={handlePrev}
      >
        <GrFormPrevious className="text-lg" />
        <span>Prev</span>
      </button>
    )}

    {currentIndex !== data.length - 1 && (
      <button
        className="custom-button bg-primaryColor text-white px-4 py-2 rounded-md shadow-md hover:bg-lightPrimaryColor transition duration-200 flex items-center space-x-2 ml-auto"
        onClick={handleNext}
      >
        <span>Next</span>
        <MdNavigateNext className="text-lg" />
      </button>
    )}
  </div>
</div>

    </>
  );
};

export default Testemonial;
