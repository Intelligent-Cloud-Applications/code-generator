import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import './Footer.css'
import { useContext } from 'react'
import InstitutionContext from '../../Context/InstitutionContext'

const Footer = (props) => {
  const InstitutionData = useContext(InstitutionContext).institutionData
  const Navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [props.initialContent])

  return (
    <div>
      <div className={`bg-black`}>
        <div
          className={` footerheight max800:h-[30rem] flex flex-col justify-between sm:flex-row h-[17rem] max600:flex-col max600:justify-center p-12 gap-6 max1358:justify-center w-[100vw] z-[1000]`}
        >
          <div className={`mb-5`}>
            <a
              href="/"
              className={`transition duration-200 flex justify-center`}
            >
              <img
                className={`w-[15rem] h-[10rem] object-contain`}
                src={InstitutionData.logoUrl}
                alt=""
              />
            </a>
          </div>

          <ul
            className={`flex flex-col gap-4 sm:flex-row sm:gap-8 max950:gap-4 text-[1.2rem] text-white flex-wrap max1050:justify-center pl-0`}
          >
            <li
              className={`flex flex-col gap-[0.7rem] items-center text-center`}
            >
              <h2 className={`text-[1.2rem] mb-[0]`}>Useful Links</h2>
              <hr className={`w-[100%] text-white mb-[0] `} />

              <p
                className={`cursor-pointer mb-[0]`}
                onClick={() => {
                  Navigate('/query')
                }}
              >
                Contact Us
              </p>
              <a
                className={`cursor-pointer text-white text-decoration-none`}
                href={InstitutionData?.Footer_Link_1}
                target="_blank"
                rel="noreferrer"
              >
                BWorkz
              </a>
              <a
                className={`cursor-pointer text-decoration-none text-white`}
                href={InstitutionData?.Footer_Link_2}
                target="_blank"
                rel="noreferrer"
              >
                Zumba
              </a>
              <a
                className={`cursor-pointer text-decoration-none text-white`}
                href="https://awsaiapp.com/"
                target="_blank"
                rel="noreferrer"
              >
                AWSAIAPP
              </a>
            </li>
          </ul>
        </div>

        <div
          className={`h-16 flex w-full items-center justify-center px-[2rem] sm:justify-start`}
          style={{
            backgroundColor: InstitutionData.LightPrimaryColor
          }}
        >
          <div
            className={`flex bg-black justify-between items-center w-[7rem] rounded-2xl h-12 p-4`}
          >
            <a
              href={InstitutionData?.Instagram}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/INSTA.png`}
                alt=""
                className={`hover:mr-2 hover:w-10 hover:h-10 w-8 h-8`}
              />
            </a>
            <a
              href={InstitutionData?.Facebook}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/FB.png`}
                alt=""
                className={`hover:mr-2 hover:w-10 hover:h-10 w-8 h-8`}
              />
            </a>
          </div>
        </div>

        <div
          className={`p-[0.5rem] flex justify-center text-white gap-2 font-sans max536:flex-col max536:text-center`}
        >
          <Link
            className={`text-white text-decoration-none`}
            to={'/privacypolicy'}
          >
            Privacy Policy
          </Link>
          <div
            className={`w-1 border-white rounded-md`}
            style={{
              backgroundColor: InstitutionData.LightPrimaryColor
            }}
          ></div>
          <Link className={`text-white text-decoration-none`} to={'/terms'}>
            Terms and Condition
          </Link>
          <div
            className={`w-1 border-white rounded-md`}
            style={{
              backgroundColor: InstitutionData.LightPrimaryColor
            }}
          ></div>
          <Link className={`text-white text-decoration-none`} to={'/refund'}>
            Cancellation/Refund Policy
          </Link>
          <div
            className={`w-1 border-white rounded-md`}
            style={{
              backgroundColor: InstitutionData.LightPrimaryColor
            }}
          ></div>
          <h5 className={`text-[1rem] sans-sarif mb-0 font-[400]`}>
            {' '}
            All rights reserved. © {new Date().getFullYear()} happyprancer.com
          </h5>
        </div>
      </div>
    </div>
  )
}

export default Footer
