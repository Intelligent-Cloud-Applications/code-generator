// Packages
import React, {useContext} from 'react';
import { Link, NavLink } from 'react-router-dom';
import institutionContext from "../../Context/InstitutionContext";
//import { useSelector } from "react-redux";

const NavBar = ({ content }) => {
  const { logoUrl, PrimaryColor } = useContext(institutionContext).institutionData;
//  const { logoUrl, PrimaryColor } = useSelector((state) => state.institutionData.data);

  const height = 'h-16';
  
  const logo =
    <Link to='/'>
      <img
        src={logoUrl}
        alt='Logo'
        width='80'
        height='80'
      />
    </Link>
  
  return (
    <div className={height}>
      <div
        className={
          `flex flex-row justify-between items-center
          pr-12 pl-16 bg-white fixed w-full z-50 ${height}
          border-b-2 border-b-black`
        }
      >
        {logo}
        <div
          className='flex flex-row gap-4'
          style={{ color: PrimaryColor }}
        >
          { content.map((item, index) =>
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) => [
                    'font-semibold text-decoration-none',
                    isActive ? 'text-inherit' : 'text-stone-600',
                    'hover:text-inherit'
                  ].join(' ')}
            >
              { item.label }
            </NavLink>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar;