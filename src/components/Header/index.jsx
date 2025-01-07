import { useContext } from "react";
import institutionContext from "../../Context/InstitutionContext";
import Context from "../../Context/Context";
import AuthBar from "./AuthBar";
import NavBar from "./NavBar";

const Header = () => {
  const { isAuth, userData } = useContext(Context);
  const { imgUrl, userName, status } = userData;

  const getInitials = (name) => {
    if (!name) return '';
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
    return initials;
  };

  const getColor = (name) => {
    if (!name) return '#888888';
    const colors = [
      '#FF5733', '#33FF57', '#5733FF',
      '#FF5733', '#33FF57', '#5733FF',
      '#FF5733', '#33FF57', '#5733FF',
      '#FF5733', '#33FF57', '#5733FF'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const profileImage = imgUrl ? (
    <img
      className={`h-[30px] w-[30px] rounded-full bg-white border-[3px] ${status === "Active"
        ? 'border-lightestPrimaryColor'
        : status === "Trial"
          ? 'border-yellow-500'
          : 'border-red-500'}
       rounded-full`}
      src={imgUrl}
      alt="profile"
    />
  ) : (
    <div
      className={`rounded-full h-[30px] w-[30px] flex items-center justify-center text-sm text-white border-[3px] ${status === "Active"
        ? 'border-lightestPrimaryColor'
        : status === "Trial"
          ? 'border-yellow-500'
          : 'border-red-500'}
       rounded-full`}
      style={{
        backgroundColor: getColor(userName),
      }}
    >
      {getInitials(userName)}
    </div>
  );

  const authBarContent = isAuth
    ? [
      { label: `Welcome, ${userName?.split(' ')[0]}`, path: "/dashboard" },
      { label: "Dashboard", path: "/dashboard" },
      { label: profileImage, path: "/dashboard" },
    ]
    : [
      { label: 'Login', path: '/login' },
      { label: 'Join Now', path: '/signup' },
      // { label: process.env.REACT_APP_STAGE !== 'PROD' && "Dev", path: "/auth" },
    ];

  const navBarContent = [
    { label: "ABOUT US", path: "/aboutus" },
    { label: "INSTRUCTOR", path: "/instructor" },
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