// Packages
import { Link } from 'react-router-dom';


// Code
const PolicySection = ({ content }) => {
  return (
    <div
      className='bg-black py-2 flex justify-center items-center max600:flex-col max600:gap-2'
    >
    { content.map((item, index) =>
      <Link key={ index } to={ item.path } className='text-white px-2'>
        { item.label }
      </Link>
    )}
    </div>
  )
}

export default PolicySection;