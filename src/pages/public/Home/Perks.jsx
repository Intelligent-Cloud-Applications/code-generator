import React, { useContext, useEffect } from 'react';
import InstitutionContext from '../../../Context/InstitutionContext';

const Perks = () => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const services = InstitutionData.Services;

  useEffect(() => {
    // Preload the background image                  
    const bgImage = new Image();
    bgImage.src = InstitutionData.ServicesBg;

    // Preload the portrait image
    if (InstitutionData.ServicesPortrait) {
      const portraitImage = new Image();
      portraitImage.src = InstitutionData.ServicesPortrait;
    }
  }, [InstitutionData.ServicesBg, InstitutionData.ServicesPortrait]);

  console.log(services);

  return (
    <div
      className="New flex justify-between max600:h-[60rem] h-[52rem] blurimg w-[auto] relative pt-[3.5rem] pb-20 pr-5 pl-5 max600:flex-col max600:mx-0 max600:items-start max600:m-0 max600:w-[100vw] overflow-hidden"
      style={{
        backgroundImage: `url(${InstitutionData.ServicesBg})`,
        backgroundSize: "cover",
      }}
    >
      <div
        className="p-10 flex flex-col max600:items-center justify-between bg-transparent border-y-[0.4rem] rounded-tl-lg rounded-bl-lg border-l-[0.4rem] w-[38vw] h-[45rem] max600:h-auto max600:border-0 max600:w-[100%]"
        style={{
          borderColor: InstitutionData.PrimaryColor,
        }}
      >
        {services?.slice(0, 2)?.map((service, index) => (
          <div
            className="w-[20rem] max800:w-[14rem] max600:w-[100%]"
            key={index}
          >
            <h1
              className="text-[2rem] max800:text-[1.5rem] font-russo max600:text-[1.6rem]"
              style={{ color: InstitutionData?.ServicesBg ? "white" : "black" }}
            >
              {service?.title}
            </h1>
            <ul
              className="max800:text-[0.8rem] list-disc max950:pl-[3rem] max600:pl-0 text-justify"
              style={{ color: InstitutionData?.ServicesBg ? "white" : "black" }}
            >
              {service?.items?.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className="Over p-10 flex flex-col max600:items-center max600:pt-0 items-end bg-transparent border-y-[0.4rem] rounded-tr-lg rounded-br-lg border-r-[0.4rem] w-[38vw] h-[45rem] max600:h-auto max600:border-0 max600:w-[100%] justify-between"
        style={{
          borderColor: InstitutionData.PrimaryColor,
        }}
      >
        {services.slice(2).map((service, index) => (
          <div
            className="w-[20rem] max800:w-[14rem] max600:w-[100%]"
            key={index}
          >
            <h1
              className="text-[2rem] max800:text-[1.5rem] max600:text-[1.6rem] font-russo max950:pl-[3rem] max600:pl-0"
              style={{ color: InstitutionData.ServicesBg ? "white" : "black" }}
            >
              {service.title}
            </h1>
            <ul
              className="max800:text-[0.8rem] list-disc max950:pl-[3rem] max600:pl-0 text-justify"
              style={{ color: InstitutionData.ServicesBg ? "white" : "black" }}
            >
              {service?.items?.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {InstitutionData.ServicesPortrait && (
        <img
          src={InstitutionData.ServicesPortrait}
          className="xs:block hidden absolute left-[55%] -translate-x-[60%] w-[40vw] max1078:-left-[50.9%] borderbox-hidden bottom-[-39px] max1920:bottom-[10%]"
          alt=""
        />
      )}
    </div>
  );
};

export default Perks;
