// Packages
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';


// Code
const SocialSection = ({ content }) => {
  const { PrimaryColor } = useSelector((state) => state.institutionData.data);
  
  return (
    <div
      className={
        `flex flex-row items-center
        px-8 py-2`
      }
      style={{ backgroundColor: PrimaryColor }}
    >
      <div
        className={
          `flex flex-row gap-2 items-center justify-center
          w-32 h-12 px-4 py-2 bg-black rounded-xl`
        }
      >
        { content.map((item, index) =>
          <Link key={ index } to={ item.link }>
            { item.icon }
          </Link>
        )}
      </div>
    </div>
  )
}

export default SocialSection;