//Packages
import { Link } from "react-router-dom";

//Code
const LinksSection = ({ content }) => {
  return (
    <ul className="flex flex-col gap-2 text-white justify-center items-center">
      <h2 className="text-2xl font-semibold py-4 border-b-2 border-white">Useful Links</h2>
      {content.map((item, index) => {
        return item.link ? (
          <Link key={index} to={item.Link} className="text-lg">
            {item.label}
          </Link>
        ) : (
          <p className="text-lg" onClick={() => {
            Navigate(item.path)
          }}>
            {item.label}
          </p>
        );
      })}
    </ul>
  );
};

export default LinksSection;
