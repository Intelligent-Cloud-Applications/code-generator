// Packages
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import institutionContext from "../../Context/InstitutionContext";
//import { useSelector } from "react-redux";

const AuthBar = ({ content }) => {
  const { PrimaryColor } = useContext(institutionContext).institutionData;
//  const { PrimaryColor } = useSelector((state) => state.institutionData.data);
  const height = 'h-8';
    
  return (
    <div className={height}>
      <div
        className={
          `flex flex-row gap-4 items-center justify-end
          fixed z-50 w-full pr-12 ${height}`
        }
        style={{ backgroundColor: PrimaryColor }}
      >
        { content.map((item, index) =>
          <NavLink
            key={index}
            to={item.path}
            className={({isActive}) =>
              [
                isActive ? 'text-white' : 'text-stone-300',
                'text-md font-bold text-decoration-none hover:text-stone-100',
              ].join(' ')
            }
          >
            { item.label }
          </NavLink>
        )}
      </div>
    </div>
  )
}

export default AuthBar;