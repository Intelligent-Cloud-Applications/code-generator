import { Link } from "react-router-dom";
import LinksSection from "./LinksSection";

const UpperFooter = ({ content }) => {
  const { logo, links } = content;

  const logoItem = (
    <Link to="/">
      <img src={logo} alt="Logo" width="220" height="220" />
    </Link>
  );
  return (
    <div className="bg-black flex flex-row justify-between items-center px-12 h-[15rem] max600:flex-col max600:h-[20rem] max600:justify-evenly">
      <div>{logoItem}</div>
      <LinksSection content={links} />
    </div>
  );
};

export default UpperFooter;
