// Packages
import { Link } from 'react-router-dom';


// Code
const PolicySection = ({ content }) => {
  return (
    <div
      className='bg-black'
    >
    { content.map((item, index) =>
      <Link key={ index } to={ item.path }>
        { item.label }
      </Link>
    )}
    </div>
  )
}

export default PolicySection;