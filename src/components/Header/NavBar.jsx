// Packages
import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import institutionContext from "../../Context/InstitutionContext";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
//import { useSelector } from "react-redux";

const NavBar = ({ content }) => {
  const { logoUrl, PrimaryColor } =
    useContext(institutionContext).institutionData;
  //  const { logoUrl, PrimaryColor } = useSelector((state) => state.institutionData.data);

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
      </Navbar>
    </div>
  );
};

export default NavBar;
