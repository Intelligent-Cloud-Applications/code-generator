import React, { useState, useEffect } from "react";
import "./Carousel.css";
// import { PropertyDefault } from "./PropertyDefault";



const images = [
  "https://plus.unsplash.com/premium_photo-1661777196224-bfda51e61cfd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1508050249562-b28a87434496?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://media.istockphoto.com/id/502937834/photo/young-woman-practicing-yoga-on-the-beach-at-sunset.jpg?s=2048x2048&w=is&k=20&c=iiX-DAKaitOWn_QElB1i3DqduIN1DudugYAwRmC0jkc=",
  "https://media.istockphoto.com/id/1219401141/photo/woman-practicing-yoga-in-lotus-position-at-park.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZizQtvNJhqZ73gA6sRvr99t5w3fWHT0_XXdAkEbjr2Q=",
  "https://media.istockphoto.com/id/1567420260/photo/indian-young-man-doing-namaste-posture-or-yoga-with-closed-eyes-while-sitting-at-home-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=6pDmF5kjVAPwTazlxzHiLXNS8ka53TDDUhtyZEfjBG4=",
  "https://media.istockphoto.com/id/589554884/photo/woman-in-yoga-asana-vrikshasana-tree-pose-in-mountains-outdoors.webp?a=1&b=1&s=612x612&w=0&k=20&c=WRmj3Um1hS1F6n-Hi--mcBRFqfc1fkZjIWoLBSs-DY8=",
  "https://media.istockphoto.com/id/498058082/photo/warrior-pose-from-yoga.webp?a=1&b=1&s=612x612&w=0&k=20&c=6NJYLf79BADo0IBNNynexxFPMCmRpQzPMkL8DIgTb8Y=",
  "https://images.unsplash.com/photo-1644612105654-b6b0a941ecde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1641971216965-af67e99045a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHlvZ2ElMjBjbGFzc3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1671581081106-283f2bcdef71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHlvZ2ElMjBjbGFzc3xlbnwwfHwwfHx8MA%3D%3D",
];

const Carousel = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="435"
        viewBox="0 0 869 435"
        fill="none"
        className="absolute top-4 left-0 w-screen z-0"
      >
        <g filter="url(#filter0_f_1_249)">
          <path
            d="M683.958 -281.151L411.354 152.711L287.5 223.5L84.5172 250.619L-48.9053 250.619L-110.817 191.586L-711.576 -578.952L68.113 -1138.81L683.958 -281.151Z"
            fill="url(#paint0_angular_1_249)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_249"
            x="-895.872"
            y="-1323.11"
            width="1764.13"
            height="1758.02"
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
              stdDeviation="92.1479"
              result="effect1_foregroundBlur_1_249"
            />
          </filter>
          <radialGradient
            id="paint0_angular_1_249"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-62.6805 -337.621) rotate(-177.533) scale(663.694 488.191)"
          >
            <stop offset="0.146" stop-color="white" stop-opacity="0" />
            <stop offset="0.506955" stop-color="#225C59" />
            <stop offset="1" stop-color="white" stop-opacity="0.53" />
          </radialGradient>
        </defs>
      </svg>
      <div className="mb-7">
        <h1 className="hybrid-heading relative z-10 text-3xl font-bold text-center mt-8 text-[3rem] mb-4 text-lightPrimaryColor ">
          Hybrid Class
        </h1>
        <p className="relative z-10 text-[1rem] px-4 mt-2 text-center font-[600]">
          A unique dance program offering both in-person and online classes,
          perfect for dancers seeking flexibility and a comprehensive learning
          experience
        </p>
      </div>
      {/* <div className="banner">
        <div className="slider" style={{ "--quantity": images.length }}>
          {images.map((image, index) => (
            <div key={index} className="item" style={{ "--position": index }}>
              <img src={image} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
      </div> */}

      <div className="w-screen h-[451px]">
        <div className="relative max-w-screen h-[451px] m-auto">
          {/* <img
            className="absolute z-10 w-screen h-[103px] top-[330px] left-0"
            alt="Lower elipse"
            src={lowerElipse}
          /> */}
          {/* lower-full ellipse */}
          <div className="full-ellipse absolute z-10 top-[320px]"></div>
          {/* Upper full ellipse */}
          <div className="full-ellipse absolute z-10 top-[84px] "></div>
          {/* <img
            className="absolute z-10 w-screen h-[103px] top-[20px] left-0.5"
            alt="Upper elipse"
            src={upperElipse}
          /> */}


          {/* Upper half ellipse */}
          <div className="half-ellipse-border absolute z-20"></div>
          <div className="slider">
            <div className="slide-track">
              {images.map((image, index) => (
                <div key={index} className="slide">
                  <img
                    src={image}
                    alt={`Slide ${index}`}
                    className="w-[400px] h-[300px] overflow-hidden "
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Down half ellipse */}
          <div className="half-ellipse-border-down absolute z-20 h-[53px] top-[342px]"></div>
        </div>
      </div>

    </>
  );
};

export default Carousel;
