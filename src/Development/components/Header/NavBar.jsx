import React, { useContext, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import institutionContext from "../../Context/InstitutionContext";

const NavBar = ({ content }) => {
  const { logoUrl, PrimaryColor } = useContext(institutionContext).institutionData;
  const [inHybridPage, setInHybridPage] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/hybrid")) {
      setInHybridPage(true);
    } else {
      setInHybridPage(false);
    }
  }, [location.pathname]);


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
              {content.map((item, index) => (
                <NavbarLink
                  className={`no-underline font-medium !text-[1rem] text-stone-500 cursor-pointer hover:text-primaryColor
                  }`}
                  key={item.path}
                >
                 <NavLink
                    to={item.path}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={({ isActive }) => ({
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: isActive || hoveredIndex === index ? PrimaryColor : '#78716c',
                      transition: 'all 0.2s ease-in-out'
                    })}
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
