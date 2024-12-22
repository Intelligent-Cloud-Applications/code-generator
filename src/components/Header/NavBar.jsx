// Packages
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import React, { useContext, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import institutionContext from "../../Context/InstitutionContext";
//import { useSelector } from "react-redux";

const NavBar = ({ content }) => {
  const { logoUrl, PrimaryColor } =
    useContext(institutionContext).institutionData;
  const [inHybridPage, setInHybridPage] = React.useState(false);
  //  const { logoUrl, PrimaryColor } = useSelector((state) => state.institutionData.data);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/hybrid")) {
      setInHybridPage(true);
    } else {
      setInHybridPage(false);
    }
  }, []);

  return (
    <div className=" !h-[4.25rem]">
      <Navbar fluid style={{ borderColor: PrimaryColor }}>
        <NavbarBrand>
          <Link to="/">
            <img
              src={logoUrl}
              className="mr-3 h-6 sm:h-9"
              alt="Happyprancer Logo"
            />
          </Link>
        </NavbarBrand>
        {!inHybridPage && (
          <>
            <NavbarToggle />
            <NavbarCollapse>
              {content.map((item) => (
                <NavbarLink
                  className={`no-underline font-medium !text-[1rem] text-stone-500 cursor-pointer hover:text-primaryColor
                  }`}
                  key={item.path}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      [
                        "font-semibold text-decoration-none",
                        isActive && "text-primaryColor",
                        "hover:text-primaryColor",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </NavbarLink>
              ))}
            </NavbarCollapse>
          </>
        )}
      </Navbar>
    </div>
  );
};

export default NavBar;
