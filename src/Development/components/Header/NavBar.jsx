import React, { useContext, useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import institutionContext from "../../Context/InstitutionContext";
import Context from "../../Context/Context";
import { FaSignOutAlt } from "react-icons/fa";

const NavBar = ({ content }) => {
  const { logoUrl, PrimaryColor } = useContext(institutionContext).institutionData;
  const { isAuth, setLoading, loading } = useContext(Context);
  const [inHybridPage, setInHybridPage] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setInHybridPage(location.pathname.includes("/hybrid"));
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await Auth.signOut();
      setLoading(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="!h-[4.25rem]">
      <Navbar fluid style={{ borderColor: PrimaryColor }}>
        <NavbarBrand>
          <Link to="/">
            <img src={logoUrl} className="mr-3 h-6 sm:h-9" alt="Happyprancer Logo" />
          </Link>
        </NavbarBrand>

        {!inHybridPage && (
          <>
            {/* Navbar Toggle for Mobile */}
            <NavbarToggle onClick={() => setIsMobileMenuOpen((prev) => !prev)} />

            {/* Navbar Collapse */}
            <NavbarCollapse className={isMobileMenuOpen ? "block" : "hidden sm:flex"}>
              {content.map((item, index) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="no-underline font-medium text-[1rem] text-stone-500 cursor-pointer hover:text-primaryColor"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={({ isActive }) => ({
                    fontWeight: 600,
                    textDecoration: "none",
                    color: isActive || hoveredIndex === index ? PrimaryColor : "#78716c",
                    transition: "all 0.2s ease-in-out",
                  })}
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Logout Button - Visible Only on Mobile */}
              {isAuth && (
                <div className="sm:hidden mt-4 flex justify-center">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primaryColor rounded-md transition w-full text-center"
                    disabled={loading}
                  >
                    {loading ? "Logging out..." : "Logout"}
                    <FaSignOutAlt className="ml-2" />
                  </button>
                </div>
              )}
            </NavbarCollapse>
          </>
        )}
      </Navbar>
    </div>
  );
};

export default NavBar;
