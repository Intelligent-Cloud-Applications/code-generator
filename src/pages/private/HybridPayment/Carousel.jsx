import React, { useState, useEffect } from "react";
import "./Carousel.css";
// import { PropertyDefault } from "./PropertyDefault";



const images = [
  "https://s3-alpha-sig.figma.com/img/1f7f/4cb0/3c1803f992c9c038b69b6cfb2b99dfc7?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VfPoQ23Rb-EqHtgIAVbiIx5LECFOvmL1UFQcmFaTcVRJHGZ983yJ9baT3avSwFXEAkRuBSZ2HAAfXvJEtv9gqH7Zjuxxwx3kEyXZ38NIqjAfjqi-5a3wEZAjIaaaZ1~acZ2g12WSSkCLnTjCY1Gsa4HLk9~IQCCsd8c2iL6UGfMaw-9OqdsfxadcuS7YZH07zFyKECyfczaUa7cZsgTZwpxPawX1mVZ28DLB7dYTBGI7HhHM8MLXGOQcbQSudXiWxdOKrQOS8bFOpvLEq39lsSMf1AX11egwWRWLy8~VK4xDWeW~5qI8EOqkqvRSsyhm34hx6s6xbe1265KXwoV7zw__",
  "https://s3-alpha-sig.figma.com/img/c8c9/f987/d29637dd0f2a92ece005baa0440b4f27?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=L~M7xajk7fa7B7p7UxylN9UD4xDyg1VeCqkM00q2C3RdNJFiTOB~rgybrxsfE31X7cqZil6OJGITFzfX0GVHto-emd027vWNVvmJWFeKbozpkYZAZs7lmBuGwNeX7ejUZR0BtrFx1bZCCRHhG8BKUR8Qe0XqlpsKY2fc38fXEyh~I93cvxGz54YlWk7ikdr8yv0RgrYIkHHSDBhgu1D05uC2S75SnTx6alSItbo-rgaHtBLdbeFCiBCkD5cE4Zabx42OcRWcM5il~6RDwcOxjIpm3pUTm5LPshyDD1CQ98xGn6NfOQIhxtRkW32r18E9AlUTxXeCss8cVxZxeTWs0g__",
  "https://s3-alpha-sig.figma.com/img/241b/b526/d0ebc2b37b6268244fe6218ccd471327?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Pp4XRo9MWl4mhBMgNCfDFnqbkci4S0DFqQk2LTljV3Upi6puPjdQgtaLWv9VRRfPZwYcTwbU5AWBBo6EAon4ZixMaAQWbSukRuHIxaFseubhc7tLwPiRiLUVrccvWEnlJrHuwlBB7tEZh6OWLUZ0Y-PFhO9Z8AwXVLnEKoNGmrcvNvdIX55LT8upF6xd~Du31NyyFUBKDm2I8h9nWaATtWYjv56hbIGq8LddRGp7qeyOLp4JlYmolC3UtXTICBcDgR-GDX-~veNsy7q90T~Hyig85wdIR80JilcwduXFFild~kjIhfPUQSgdXtLeu3EQNhkndc4XkAhIPzRba0UfeA__",
  "https://s3-alpha-sig.figma.com/img/5abc/ce5d/6b88af5ccb7a572ce7a75eaf3b7800a2?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pGZ9ZirBnTavOQrtm5FzM5SmRlGEXpstHGU1juEOxQwRXVb49QjR2UaMf-slV5tNTfwPcnF48GSOjBPpzCK2K3vblsQ144TU2IU-I1ZmiJKF-R51xU4hywLd4NiQPxV6T6pkky6xMAyQ-C0Eh765bXxaUj~aGyX6l1NVkanLt6qq6EJl5gnkIiptpx5~oX2Vox8ANlS9HkDfM2ez75KERy6kB~8oAW7YpugJg6PK1catALEwCD9FMYmXOhaM-WGkj3OZNmD7tKbPrD5bOmjGCnkSI82o8jBD-okkaLou1jbdzGk-UhDzYs0n-ZHFRuqyhrl6sa5Cubn-48Oui6S0SA__",
  "https://s3-alpha-sig.figma.com/img/a972/282f/3a7b0df4c66b09b196e35845b253d42c?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=F3KSW853hDdMabmST6LpneEga0hOw82lDP~RBYO42eQTH1sQ5-I~79Rp5Rk34TbADzl~EPpGzcjdqDePR7ZpYuwRsOgmd76LB2M1BNa9vMgdyZmlP01-nBmhfFXgrBfxq4Ww3LlpCxCIM3ZgF7mQdhjTnlb7NDtwi~4t1CU4w7h1ovdaoPMq0gBKDjwgWW2U9~p5te7vH9yJWr9SezTfsfknHCxsOJLpaE6fR1ihLz7hBgNIaJ1PQ~2oCmQ84-plUnJIujNPihALdpM7ocGBLrz3LaFa2Kx0r6dkBjTcvicqcAFeILQtiaqxSMbX2fhR~Sxp2Nhf2ny66PqybE3erQ__",
  "https://s3-alpha-sig.figma.com/img/5abc/ce5d/6b88af5ccb7a572ce7a75eaf3b7800a2?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pGZ9ZirBnTavOQrtm5FzM5SmRlGEXpstHGU1juEOxQwRXVb49QjR2UaMf-slV5tNTfwPcnF48GSOjBPpzCK2K3vblsQ144TU2IU-I1ZmiJKF-R51xU4hywLd4NiQPxV6T6pkky6xMAyQ-C0Eh765bXxaUj~aGyX6l1NVkanLt6qq6EJl5gnkIiptpx5~oX2Vox8ANlS9HkDfM2ez75KERy6kB~8oAW7YpugJg6PK1catALEwCD9FMYmXOhaM-WGkj3OZNmD7tKbPrD5bOmjGCnkSI82o8jBD-okkaLou1jbdzGk-UhDzYs0n-ZHFRuqyhrl6sa5Cubn-48Oui6S0SA__",
  "https://s3-alpha-sig.figma.com/img/1f7f/4cb0/3c1803f992c9c038b69b6cfb2b99dfc7?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VfPoQ23Rb-EqHtgIAVbiIx5LECFOvmL1UFQcmFaTcVRJHGZ983yJ9baT3avSwFXEAkRuBSZ2HAAfXvJEtv9gqH7Zjuxxwx3kEyXZ38NIqjAfjqi-5a3wEZAjIaaaZ1~acZ2g12WSSkCLnTjCY1Gsa4HLk9~IQCCsd8c2iL6UGfMaw-9OqdsfxadcuS7YZH07zFyKECyfczaUa7cZsgTZwpxPawX1mVZ28DLB7dYTBGI7HhHM8MLXGOQcbQSudXiWxdOKrQOS8bFOpvLEq39lsSMf1AX11egwWRWLy8~VK4xDWeW~5qI8EOqkqvRSsyhm34hx6s6xbe1265KXwoV7zw__",
  "https://s3-alpha-sig.figma.com/img/c8c9/f987/d29637dd0f2a92ece005baa0440b4f27?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=L~M7xajk7fa7B7p7UxylN9UD4xDyg1VeCqkM00q2C3RdNJFiTOB~rgybrxsfE31X7cqZil6OJGITFzfX0GVHto-emd027vWNVvmJWFeKbozpkYZAZs7lmBuGwNeX7ejUZR0BtrFx1bZCCRHhG8BKUR8Qe0XqlpsKY2fc38fXEyh~I93cvxGz54YlWk7ikdr8yv0RgrYIkHHSDBhgu1D05uC2S75SnTx6alSItbo-rgaHtBLdbeFCiBCkD5cE4Zabx42OcRWcM5il~6RDwcOxjIpm3pUTm5LPshyDD1CQ98xGn6NfOQIhxtRkW32r18E9AlUTxXeCss8cVxZxeTWs0g__",
  "https://s3-alpha-sig.figma.com/img/241b/b526/d0ebc2b37b6268244fe6218ccd471327?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Pp4XRo9MWl4mhBMgNCfDFnqbkci4S0DFqQk2LTljV3Upi6puPjdQgtaLWv9VRRfPZwYcTwbU5AWBBo6EAon4ZixMaAQWbSukRuHIxaFseubhc7tLwPiRiLUVrccvWEnlJrHuwlBB7tEZh6OWLUZ0Y-PFhO9Z8AwXVLnEKoNGmrcvNvdIX55LT8upF6xd~Du31NyyFUBKDm2I8h9nWaATtWYjv56hbIGq8LddRGp7qeyOLp4JlYmolC3UtXTICBcDgR-GDX-~veNsy7q90T~Hyig85wdIR80JilcwduXFFild~kjIhfPUQSgdXtLeu3EQNhkndc4XkAhIPzRba0UfeA__",
  "https://s3-alpha-sig.figma.com/img/5abc/ce5d/6b88af5ccb7a572ce7a75eaf3b7800a2?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pGZ9ZirBnTavOQrtm5FzM5SmRlGEXpstHGU1juEOxQwRXVb49QjR2UaMf-slV5tNTfwPcnF48GSOjBPpzCK2K3vblsQ144TU2IU-I1ZmiJKF-R51xU4hywLd4NiQPxV6T6pkky6xMAyQ-C0Eh765bXxaUj~aGyX6l1NVkanLt6qq6EJl5gnkIiptpx5~oX2Vox8ANlS9HkDfM2ez75KERy6kB~8oAW7YpugJg6PK1catALEwCD9FMYmXOhaM-WGkj3OZNmD7tKbPrD5bOmjGCnkSI82o8jBD-okkaLou1jbdzGk-UhDzYs0n-ZHFRuqyhrl6sa5Cubn-48Oui6S0SA__",
  "https://s3-alpha-sig.figma.com/img/a972/282f/3a7b0df4c66b09b196e35845b253d42c?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=F3KSW853hDdMabmST6LpneEga0hOw82lDP~RBYO42eQTH1sQ5-I~79Rp5Rk34TbADzl~EPpGzcjdqDePR7ZpYuwRsOgmd76LB2M1BNa9vMgdyZmlP01-nBmhfFXgrBfxq4Ww3LlpCxCIM3ZgF7mQdhjTnlb7NDtwi~4t1CU4w7h1ovdaoPMq0gBKDjwgWW2U9~p5te7vH9yJWr9SezTfsfknHCxsOJLpaE6fR1ihLz7hBgNIaJ1PQ~2oCmQ84-plUnJIujNPihALdpM7ocGBLrz3LaFa2Kx0r6dkBjTcvicqcAFeILQtiaqxSMbX2fhR~Sxp2Nhf2ny66PqybE3erQ__",
  "https://s3-alpha-sig.figma.com/img/5abc/ce5d/6b88af5ccb7a572ce7a75eaf3b7800a2?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pGZ9ZirBnTavOQrtm5FzM5SmRlGEXpstHGU1juEOxQwRXVb49QjR2UaMf-slV5tNTfwPcnF48GSOjBPpzCK2K3vblsQ144TU2IU-I1ZmiJKF-R51xU4hywLd4NiQPxV6T6pkky6xMAyQ-C0Eh765bXxaUj~aGyX6l1NVkanLt6qq6EJl5gnkIiptpx5~oX2Vox8ANlS9HkDfM2ez75KERy6kB~8oAW7YpugJg6PK1catALEwCD9FMYmXOhaM-WGkj3OZNmD7tKbPrD5bOmjGCnkSI82o8jBD-okkaLou1jbdzGk-UhDzYs0n-ZHFRuqyhrl6sa5Cubn-48Oui6S0SA__",
];

const Carousel = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="435"
        viewBox="0 0 869 435"
        fill="none"
        className="absolute top-4 left-0 w-screen"
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
        <h1 className="text-3xl font-bold text-center mt-8 text-[3rem] mb-4 text-lightPrimaryColor">
          Hybrid Class
        </h1>
        <p className="text-[1rem] mt-2 text-center font-[600]">
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
