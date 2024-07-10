// Packages
import { useSelector } from "react-redux";

// Local
import SocialSection from './SocialSection';
import PolicySection from './PolicySection';

const Footer = () => {
  const { Facebook, Instagram } = useSelector((state) => state.institutionData.data);
  
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
  ]
  
  return (
    <footer>
      {/*<LinkSection />*/}
      <SocialSection content={ socialMedias } />
      <PolicySection content={ policies } />
    </footer>
  )
}

export default Footer;