import React, { useContext, useEffect, useState } from 'react';
import InstitutionContext from '../../../Context/InstitutionContext';

const Hero = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const [contentSrc, setContentSrc] = useState(`${InstitutionData.videoUrl}`);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    const isVideoFile = contentSrc.match(/\.(mp4|webm|ogg)$/);
    setIsVideo(isVideoFile);
    
    if (isVideoFile) {
      const highResVideo = new Image();
      highResVideo.src = `${InstitutionData.videoUrl}`;
      highResVideo.onload = () => {
        setContentSrc(`${InstitutionData.videoUrl}`);
      };
    }
  }, [InstitutionData.videoUrl, contentSrc]);

  return (
    <div className={`flex items-center justify-center h-[30rem] pb-20`}>
      <div className={`absolute z-10 flex flex-col items-center w-screen content`}>
        <div className={`w-[auto] text-left flex flex-column`}>
          {/* <p className={`w-full italic max1250:w-[50%] max536:w-[90vw] max536:mr-5  max800:w-[80%]  text-[2rem] max800:text-[1.2rem] max1250:text-[1.8rem text-white`}>{InstitutionData.TagLine1 || ""}</p> */}
          <h1 className={`w-full max1250:w-[50%] max536:w-[90vw] max800:w-[80%] text-[5.5rem] max800:text-[3.6rem] max1250:text-[4.2rem] text-white text-center`}>
            {InstitutionData.TagLine}
          </h1>
          {/* only for happyprancer comment it for other institutions */}
          <p className={`w-full italic max1250:w-[80%] max1250:ml-14 max536:w-[80vw] max536:text-center max536:ml-6 max800:w-[80%] text-[1.7rem] max800:text-[1.1rem] text-white max536:mt-2`}>
            {InstitutionData.TagLine1 || ""}
          </p>
        </div>
      </div>
      <div className={`-z-10`}>
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline={true}
            controls={false}
            className={`object-cover object-top h-[38rem] w-screen max-w-screen max600:h-[35rem]`}
            preload="metadata"
          >
            <source
              src={contentSrc}
              type="video/mp4"
            />
          </video>
        ) : (
          <img
            src={contentSrc}
            alt="bg-img"
            className={`object-cover object-top h-[38rem] w-screen bg-[#000000]  max-w-screen`}
          />
        )}
      </div>
    </div>
  );
}

export default Hero;
