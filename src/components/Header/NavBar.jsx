// Packages
import React, { useState, useContext } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import institutionContext from "../../Context/InstitutionContext";
import {
  Flowbite,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Nav } from "react-bootstrap";
//import { useSelector } from "react-redux";

const customTheme = {
  navbar: {
    root: {
      base: "bg-white !px-12 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-4 border-b fixed z-50 w-full",
      rounded: {
        on: "rounded",
        off: "",
      },
      bordered: {
        on: "border",
        off: "",
      },
      inner: {
        base: "mx-auto flex flex-wrap items-center justify-between ",
        fluid: {
          on: "",
          off: "container",
        },
      },
    },
    brand: {
      base: "flex items-center",
    },
    collapse: {
      base: "w-full md:block md:w-auto max800:mt-4",
      list: "mb-0 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
      hidden: {
        on: "hidden",
        off: "",
      },
    },
    link: {
      base: "block py-2 pl-3 pr-4 md:p-0",
      active: {
        on: "text-primaryColor",
        off: "text-black",
      },
      disabled: {
        on: "text-gray-400 hover:cursor-not-allowed dark:text-gray-600",
        off: "",
      },
    },
    toggle: {
      base: "inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden",
      icon: "h-6 w-6 shrink-0",
    },
  },
};

const NavBar = ({ content }) => {
  const Navigate = useNavigate();
  const [active, setActive] = useState("");
  const { logoUrl, PrimaryColor } =
    useContext(institutionContext).institutionData;
  //  const { logoUrl, PrimaryColor } = useSelector((state) => state.institutionData.data);

  const handleMenuItemClick = (path) => {
    Navigate(path);
    setActive(path);
  };

  return (
    <div className=" !h-[4.25rem]">
      <Flowbite theme={{ theme: customTheme }}>
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
                active={active === item.path}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "font-semibold text-decoration-none",
                      isActive && "text-primaryColor",
                      "hover:text-primary",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              </NavbarLink>
            ))}
          </NavbarCollapse>
        </Navbar>
      </Flowbite>
    </div>
  );
};

export default NavBar;
