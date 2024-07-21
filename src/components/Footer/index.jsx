// Packages
//import { useSelector } from "react-redux";

// Local
import UpperFooter from "./UpperFooter";
import SocialSection from './SocialSection';
import PolicySection from './PolicySection';
import {useContext} from "react";
import institutionContext from "../../Context/InstitutionContext";

const Footer = () => {
  const { logoUrl, Facebook, Instagram, Footer_Link_1, Footer_Link_2 } = useContext(institutionContext).institutionData;
//  const { logoUrl, Facebook, Instagram, Footer_Link_1, Footer_Link_2 } = useSelector((state) => state.institutionData.data);
  
  const SocialIcon = ({ name, url }) =>
    <img
      src={ url } alt={ `${name} Icon` }
      className='w-8 h-8 hover:w-10 hover:h-10'
    />
  
  const socialMedias = [
    { icon: <SocialIcon name='Instagram' url='https://institution-utils.s3.amazonaws.com/institution-common/Assests/INSTA.png'/>, link: Instagram },
    { icon: <SocialIcon name='Facebook' url='https://institution-utils.s3.amazonaws.com/institution-common/Assests/FB.png'/>, link: Facebook },
  ];
  
  const policies = [
    { label: 'Privacy Policy', path: '/privacypolicy' },
    { label: 'Terms and Conditions', path: '/terms' },
    { label: 'Cancellation/Refund Policy', path: '/refund'},
    { label: 'All rights reserved. © 2024 happyprancer.com', path: '/'}
  ]

  const links = [
    { label: 'Contact us', path: '/query'},
    { label: 'BWorkz', link: Footer_Link_1},
    { label: 'Zumba', link: Footer_Link_2}
  ]
  
  const upperFooterContent = {
    logo: logoUrl,
    links: links
  }

  return (
    <footer>
      <UpperFooter content={ upperFooterContent }/>
      <SocialSection content={ socialMedias } />
      <PolicySection content={ policies } />
    </footer>
  )
}

export default Footer;