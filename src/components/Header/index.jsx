// Packages
//import { useSelector } from 'react-redux';

// Local
import AuthBar from "./AuthBar";
import NavBar from "./NavBar";
import institutionData from "../../utils/constants";
import { useContext } from "react";
import institutionContext from "../../Context/InstitutionContext";
import Context from "../../Context/Context";

// Code
const Header = () => {
  const { isAuth, userData } = useContext(Context);
  //  const { isAuth, data } = useSelector((state) => state.userData);
  const { profileImageUrl, userName, status } = userData;

  const profileImage = (
    <img
      src={profileImageUrl || institutionData.defaultProfileImageUrl}
      alt="Profile"
      width="30"
      height="30"
      className={`border-[3px] ${status === "Active" ? 'border-lighestPrimaryColor' : 'border-red-500'} rounded-full`}
    />
  );

  const authBarContent = isAuth
    ? [
        { label: `Welcome, ${userName.split(' ')[0]}`, path: "/dashboard" },
        { label: "Dashboard", path: "/dashboard" },
        { label: profileImage, path: "/dashboard" },
      ]
    : [
        { label: 'Login', path: '/login' },
        { label: 'Join Now', path: '/signup' },
        { label: process.env.REACT_APP_STAGE !== 'PROD' && "Dev", path: "/auth" },
      ];

  let navBarContent = [
    { label: "ABOUT US", path: "/aboutus" },
    { label: "INSTRUCTOR", path: "/instructor" },
    //    { label: 'SETTINGS', path: '/settings' },
    { label: "GALLERY", path: "/gallery" },
    { label: "SCHEDULE", path: "/schedule" },
  ];

  return (
    <header className="z-50">
      <AuthBar content={authBarContent} />
      <NavBar content={navBarContent} />
    </header>
  );
};

export default Header;
