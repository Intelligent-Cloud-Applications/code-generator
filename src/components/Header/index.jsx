// Packages
import { useSelector } from 'react-redux';

// Local
import AuthBar from './AuthBar';
import NavBar from './NavBar';
import { defaultProfileImageUrl } from '../../utils/constants';


// Code
const Header = () => {
  const { isAuth, data } = useSelector((state) => state.userData);
  const { profileImageUrl, userName } = data;
  
  const profileImage =
    <img
      src={ profileImageUrl || defaultProfileImageUrl }
      alt='Profile' width='30' height='30'
      className='border-[3px] border-red-500 rounded-full'
    />
  
  const authBarContent = isAuth ?
    [
      { label: `Welcome, ${ userName }`, path: '/dashboard' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: profileImage, path: '/dashboard' },
    ] : [
      { label: 'Login', path: '/login' },
      { label: 'Join Now', path: '/signup' },
    ]
  
  let navBarContent = [
    { label: 'ABOUT US', path: '/aboutus' },
    { label: 'INSTRUCTOR', path: '/instructor' },
//    { label: 'SETTINGS', path: '/settings' },
    { label: 'GALLERY', path: '/gallery' },
    { label: 'SCHEDULE', path: '/schedule' }
  ]
  
  
  return (
    <header className='z-50 border-b-2 border-b-black'>
      <AuthBar content={ authBarContent } />
      <NavBar content={ navBarContent } />
    </header>
  )
}

export default Header;