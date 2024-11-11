import PropTypes from "prop-types";
import discount from "./discount.svg"
import React from "react";
import "./SubscriptionCard.css";

export const Overview = ({
  className,
  insertYourImage = "insert-your-image-here.png",
  img = "image.png",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -right-9 z-0 opacity-70 hidden md:block"
        width="450"
        height="1581"
        viewBox="0 0 450 1581"
        fill="none"
      >
        <g filter="url(#filter0_f_34_290)">
          <path
            d="M239.797 764.711C137.204 603.674 207.299 389.035 385.163 319.589L649.941 216.207C828.459 146.505 1029.68 234.717 1099.38 413.235L1247.05 791.429C1316.75 969.947 1228.54 1171.17 1050.02 1240.87L721.984 1368.95C569.07 1428.66 397.194 1349.15 343.694 1193.95L341.891 1188.72C335.742 1170.89 327.528 1153.83 317.415 1137.9L302.907 1115.05C275.674 1072.17 267.769 1019.79 281.131 970.774C284.784 957.372 286.878 943.594 287.373 929.712L287.658 921.725C289.457 871.215 275.88 821.349 248.724 778.723L239.797 764.711Z"
            fill="url(#paint0_angular_34_290)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_34_290"
            x="0.222168"
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
              result="effect1_foregroundBlur_34_290"
            />
          </filter>
          <radialGradient
            id="paint0_angular_34_290"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(707.459 784.186) rotate(16.8193) scale(691.439 508.599)"
          >
            <stop offset="0.146" stop-color="white" stop-opacity="0" />
            <stop offset="0.506955" stop-color="#225C59" />
            <stop offset="1" stop-color="white" stop-opacity="0.53" />
          </radialGradient>
        </defs>
      </svg>
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-center mt-8 text-[3rem] mb-4 text-lightPrimaryColor">
          Overview
        </h1>
        <p className="text-[1rem] mt-2 px-4 w-2/3 mx-auto text-center font-[600]">
          Get a comprehensive look at our journey, values, and vision—your guide to what makes us unique.
        </p>
      </div>

      <div className="flex flex-wrap justify-evenly items-center space-y-8 md:space-y-0 md:space-x-4">
        {/* First Card */}
        <div className="w-[305px] sm:w-[312px] h-[289px] group">
          <div className="relative w-full sm:w-[306px] h-[234px] top-[42px] left-0 sm:left-1.5 transition-transform duration-300 ease-in-out transform group-hover:border-blue-400">
            {/* Black background layer with z-index to ensure it appears on hover */}
            <div className="absolute top-2.5 left-0 w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out border-black group-hover:bg-black group-hover:origin-bottom-right group-hover:rotate-12 z-10" />

            {/* Foreground layer */}
            <div className="absolute top-0 left-1 bg-[#225c59] border-[#651fff] w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out group-hover:border-blue-400 z-20" />

            {/* Text Content */}
            <div className="absolute top-[121px] left-[60px] font-semibold text-white text-2xl text-center leading-normal z-30">
              Master Instructors
            </div>
            <p className="absolute w-[85%] top-40 left-1/2 transform -translate-x-1/2 font-normal text-white text-sm sm:text-base text-center leading-6 z-30">
              We Have 15+ Professionally Trained Instructors
            </p>

            {/* Large Number */}
            <div className="absolute w-full top-[35px] left-1/2 transform -translate-x-1/2 text-white text-[60px] sm:text-[93px] font-normal text-center leading-none z-30">
              15+
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className={`w-[305px] sm:w-[316px] h-[302px] ${className} group`}>
          <div className="relative w-full sm:w-[305px] h-[234px] top-[55px] left-0 sm:left-[11px] transition-transform duration-300 ease-in-out transform group-hover:border-blue-600">
            <div className="absolute top-2.5 left-0 border-black w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out group-hover:bg-black group-hover:origin-bottom-right group-hover:rotate-12" />
            <div className="absolute top-0 left-[4%] sm:left-[19px] bg-[#225c59] border-[#00e5ff] w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out group-hover:border-blue-400" />

            <div className="absolute top-[121px] left-[80px] font-semibold text-white text-2xl text-center leading-normal">
              Active Members
            </div>
            <p className="absolute w-[85%] mx-auto top-40 left-8 font-normal text-white text-sm sm:text-base text-center leading-6">
              We currently have 230+ Pro Active Members
            </p>

            <div className="absolute flex items-start justify-center space-x-[-1.5rem] top-[34px] left-1/2 transform -translate-x-1/2 w-full">
              <img
                className="w-12 h-12 sm:w-[75.04px] sm:h-[75.04px] object-cover rounded-full"
                alt="Insert your image"
                src={
                  "https://s3-alpha-sig.figma.com/img/c818/2e84/ca5ca8d65a1c4482d647408cfdd2c0b7?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PCsgrclz4CxCK5tUBl59zZeLrSmBjNLYA3540IwJrp43YyE7fD0AfGWkbSYnmEpuOV~UcRCwymDkZg3G3f1XCrCkhiDkLuCbUIC8R-HXF6ZXQgqFC9Kebmm0PFVYVB8-EID66EcGnI4QUN4300pr2zFHm1mR1FW45Ce58MS2R7t9ILquyUU7dBOvwZjxei5Gp8ywQEcAeOqN7c66gSACe7v9J-JEnvYyhqCz1ExPimnpM3DsWqDa0ovn0qNO~W3H1ywwgrhi6DVh0b70dDGb~HDYjm5iZecv93dXSzfFZL-5-u7Nf~UVfE4~acULHOLNioB4cOO70SPUzkvTmU6aVw__"
                }
              />
              <img
                className="w-12 h-12 sm:w-[75.04px] sm:h-[75.04px] object-cover rounded-full"
                alt="Insert your image"
                src={
                  "https://s3-alpha-sig.figma.com/img/b688/8646/b906a6888fc4256c64d3459e67f6899c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fy6eQXYcDfu634pKZU7337RDGddNA9a0v59~jbMMOfO4PqHad5LE3tZGCweh1sHvb-FDzF6Pl07ARNLd2GL~bYIN5l17rLyJsLKQdxzJP0cp4~sf6W478OFgixKcEHpiPbFhFHvLADJYxpQl5tC5wiYMPhHk-QaO6bsj--II8u2GFSkEnfpz8yVGlHzKfpgI6~oEpzNR0J-iNqrgr0GUx2ztyel7xn2syp~pqDgs1JbUes-WaidAOR2~q0Pmo7vX-IE7TXicNsTkbCg06~zWfVXoocAqRmgUmAWkqALlIo0yOLml2b7XebhD~48mKtIApIPqFQH1Xtoxz3yHYO7d9g__"
                }
              />
              <div className="w-12 h-12 sm:w-[77.04px] sm:h-[75.04px] bg-[#225c59] rounded-full border-2 border-white flex items-center justify-center ">
                <div className="text-white text-sm sm:text-lg font-bold">
                  230+
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Card */}
        <div className="w-[305px] sm:w-[312px] h-[289px] group">
          <div className="relative w-full sm:w-[306px] h-[234px] top-[55px] transition-transform duration-300 ease-in-out transform group-hover:border-blue-400">
            <div className="absolute top-2.5 left-0 border-[#000] w-full h-56 rounded-[19px] border border-solid group-hover:border-[#128fdd] transition-all duration-300 ease-in-out group-hover:bg-black group-hover:origin-bottom-right group-hover:rotate-12" />
            <div className="absolute top-0 left-1 bg-[#225c59] border-[#128fdd] w-full h-56 rounded-[19px] border border-solid transition-all duration-300 ease-in-out group-hover:border-[#128fdd]" />

            <div className="absolute top-[121px] left-1/2 transform -translate-x-1/2 text-center font-semibold text-white text-xl sm:text-2xl leading-normal">
              Genuine Price
            </div>
            <p className="absolute w-[85%] top-40 left-1/2 transform -translate-x-1/2 font-normal text-white text-sm sm:text-base text-center leading-6">
              We offer Best Quality Service At Reasonable Price
            </p>

            <img
              className="absolute w-[78px] h-[78px] top-[33px] left-[124px] transition-transform duration-300 ease-in-out transform group-hover:scale-110"
              alt="Discount store"
              src={discount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Overview.propTypes = {
  insertYourImage: PropTypes.string,
  img: PropTypes.string,
};