import React, { useContext, useState, useEffect } from 'react';
import { BsPeopleFill } from 'react-icons/bs';
import Context from '../../../../Context/Context';
import { useNavigate } from 'react-router-dom';
import InstitutionContext from '../../../../Context/InstitutionContext';
import web from '../../../../utils/data.json'
const LeftBanner = ({ displayAfterClick }) => {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const [click, setClick] = useState(0);
  const UserCtx = useContext(Context);
  const Navigate = useNavigate();
  const isMember = UserCtx.userData.userType === 'member';
  const [bonus, setBonus] = useState(0);

  useEffect(() => {
    let currentBonus = 0;
    const targetBonus = UserCtx.userData.bonus / 100;
    const increment = targetBonus / 100;
    const intervalTime = 20;

    const interval = setInterval(() => {
      currentBonus += increment;
      if (currentBonus >= targetBonus) {
        currentBonus = targetBonus;
        clearInterval(interval);
        setBonus(currentBonus.toFixed(2));
      } else {
        setBonus(currentBonus.toFixed(2));
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [UserCtx.userData.bonus]);

  const getInitials = (name) => {
    if (!name) return '';
    const initials = name.split(' ').map((word) => word.charAt(0).toUpperCase()).join('');
    return initials;
  };

  const getColor = (name) => {
    if (!name) return '#888888';
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF5733', '#33FF57', '#5733FF', '#FF5733', '#33FF57', '#5733FF', '#FF5733', '#33FF57', '#5733FF'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className={`w-64 max1050:bg-transparent rounded-[21px] flex flex-col overflow-auto max1050:h-[15vh] max1050:w-screen max1050:fixed max1050:bottom-[-3rem] max1050:left-0 max1050:items-center max1050:z-30 font-sans h-[80%] bg-black`}>
      <div className={`flex flex-col items-center p-6 pt-12 max1050:hidden text-white`}>
        {UserCtx.userData.imgUrl ? (
          <img
            key={'profileUpdate2' + Date.now()}
            alt="profile"
            src={UserCtx.userData.imgUrl}
            className="h-24 w-24 rounded-[80%]"
          />
        ) : (
          <div className={`h-24 w-24 rounded-[80%] bg-gray-600 flex items-center justify-center text-[2.5rem] text-white`} style={{ backgroundColor: getColor(UserCtx.userData.userName) }}>
            {getInitials(UserCtx.userData.userName)}
          </div>
        )}

        <p className={`pt-3 font-bold`}>{UserCtx.userData.userName}</p>

        {UserCtx.userData.bonus && (
          <div className='font-[500] '>
            Bonus = <span className='text-[#bfffbf]'>₹ {bonus}</span>
          </div>
        )}
        {isMember && (
          <>
            <p className={`pt-1`}>
              Attendance:{' '}
              <span style={{ color: 'green' }}>
                {UserCtx.userData.currentMonthZPoints ? UserCtx.userData.currentMonthZPoints : 0}
              </span>{' '}
              /{' '}
              <span style={{ color: 'red' }}>
                {UserCtx.userData.lastMonthZPoints ? UserCtx.userData.lastMonthZPoints : 0}
              </span>
            </p>
            <p className={`pt-1`}>{`Due: ${UserCtx.userData.balance || 0}`}</p>
          </>
        )}

        <button
          className={`px-3 py-1 mt-2 rounded-xl text-black`}
          style={{ backgroundColor: InstitutionData.LightestPrimaryColor }}
          onClick={() => {
            setClick(3);
            displayAfterClick(3);
          }}
        >
          Profile
        </button>
      </div>
      <div className={`w-[100%] h-[80%] rounded-r-[7rem] rounded-b-[0] max1050:mb-[2rem] flex flex-col items-center justify-between py-12 max1050:p-0 max1050:max-w-[20rem] max1050:rounded-[6rem] max536:w-[90vw]`} style={{ backgroundColor: window.innerWidth > 1050 ? '#d9d9d944' : 'black' }}>
        <ul className={`w-[90%] gap-2 text-center flex flex-col items-center max1050:flex-row max1050:justify-between max1050:px-2 max1050:w-[104%]`}>
          <li
            className={`flex flex-col gap-1 py-[0.3rem] items-center text-[1.1rem] w-[98%] ${click === 0 && 'p-2 max1050:bg-[#181818] max1050:rounded-[20%]'} p-2 font-bold text-white rounded-md cursor-pointer max1050:w-auto`}
            style={{ backgroundColor: click === 0 ? InstitutionData.PrimaryColor : '' }}
            onClick={() => {
              setClick(0);
              displayAfterClick(0);
            }}
          >
            <img src={`https://institution-utils.s3.amazonaws.com/institution-common/images/LeftBanner/upcoming.png`} alt="" style={{ width: '1.9rem', minWidth: '1.9rem', filter: 'invert(1)' }} className={`max1050:mr-0`} />
            <p className={`max1050:text-[9.5px] max1050:font-[400] mb-0`}>
              Upcoming Classes
            </p>
          </li>
          <li
            className={`flex flex-col gap-1 py-[0.3rem] items-center text-[1.1rem] w-[98%] p-2 font-bold text-white rounded-md ${click === 1 && 'p-2 max1050:bg-[#181818] max1050:rounded-[20%]'} cursor-pointer max1050:w-auto`}
            style={{ backgroundColor: click === 1 ? InstitutionData.PrimaryColor : '' }}
            onClick={() => {
              setClick(1);
              displayAfterClick(1);
            }}
          >
            <img src={`https://institution-utils.s3.amazonaws.com/institution-common/images/LeftBanner/previous.png`} alt="" style={{ width: '1.9rem', minWidth: '1.9rem', filter: 'invert(1)' }} className={`max1050:mr-0`} />
            <p className={`max1050:text-[9.5px] max1050:font-[400] mb-0`}>
              Previous Classes
            </p>
          </li>
          <li
            className={`flex flex-col gap-1 items-center text-[1.1rem] w-[86%] p-2 font-bold text-white rounded-md ${click === 2 && 'p-2 max1050:bg-[#181818] max1050:rounded-[20%]'} cursor-pointer max1050:w-auto`}
            style={{ backgroundColor: click === 2 ? InstitutionData.PrimaryColor : '' }}
            onClick={() => {
              setClick(2);
              displayAfterClick(2);
            }}
          >
            <img src={`https://institution-utils.s3.amazonaws.com/institution-common/images/LeftBanner/youtube.png`} alt="" style={{ width: '1.9rem', minWidth: '1.9rem', filter: 'invert(1)' }} className={`max1050:mr-0`} />
            <p className={`max1050:text-[9.5px] max1050:font-[400] mb-0`}>
              Video
            </p>
          </li>
          {UserCtx.userData.userType === 'admin' && (
            <>
              <li
                className={`flex flex-col gap-1 items-center text-[1.1rem] w-[86%] mt-2 p-2 font-bold text-white rounded-md ${click === 4 && 'p-2 max1050:bg-[#181818] max1050:rounded-[20%]'} cursor-pointer max1050:w-[auto]`}
                style={{ backgroundColor: click === 4 ? InstitutionData.PrimaryColor : '' }}
                onClick={() => {
                  setClick(4);
                  displayAfterClick(4);
                }}
              >
                <BsPeopleFill color="white" size={'1.9rem'} className={`mr-2 min-w-[1.9rem] max1050:mr-0`} />
                <p className={`max1050:text-[9.5px] max1050:font-[400] mb-0`}>
                  Members
                </p>
              </li>
            </>
          )}
          <li
            className={`flex flex-col gap-1 items-center text-[1.1rem] w-[86%] mt-2 p-2 font-bold text-white rounded-md ${click === 5 && 'p-2 max1050:bg-[#181818] max1050:rounded-[20%]'} cursor-pointer max1050:w-[auto]`}
            style={{ backgroundColor: click === 5 ? InstitutionData.PrimaryColor : '' }}
            onClick={() => {
              setClick(5);
              displayAfterClick(5);
            }}
          >
            <img src={`https://institution-utils.s3.amazonaws.com/institution-common/Assests/rating.png`} alt="" style={{ width: '1.9rem', minWidth: '1.9rem' }} className="max1050:mr-0" />
            <p className="max1050:text-[9.5px] max1050:font-[400] mb-0">
              Rating
            </p>
          </li>
          {UserCtx.userData.userType === 'admin' && (
            <>
              <li
                className={`flex flex-col gap-1 items-center text-[1.1rem] w-[86%] mt-2 p-2 font-bold text-white rounded-md cursor-pointer max1050:w-[auto]`}

                onClick={() => {
                  const baseUrl = process.env.REACT_APP_STAGE === 'PROD'
                    ? 'http://awsaiapp.com'
                    : 'http://beta.awsaiapp.com';

                  const url = `${baseUrl}/allpayment/${web.InstitutionId}/${UserCtx.userData.cognitoId}/${UserCtx.userData.emailId}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                <img src={`https://institution-utils.s3.amazonaws.com/public/institution/Colorful_Web_Domain_Price_List_Instagram_Post-removebg-preview.png`} alt="" style={{ width: '5.9rem', minWidth: '3.4rem' }} className="max1050:mr-0 md:mb-[-30px] max1050:mb-0" />
                <p className="max1050:text-[9.5px] max1050:font-[400] ">
                  Pricing
                </p>
              </li>
            </>
          )}
        </ul>
        <div className={`w-[80%] h-20 rounded-3xl flex flex-col justify-center items-center max1050:hidden bg-[#ffffff79]`}>
          <p className={`font-semibold text-center mb-0`}>
            Having some Trouble?
          </p>
          <p className={`font-bold cursor-pointer`} onClick={() => { Navigate('/query'); }}>
            contact us
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftBanner;
