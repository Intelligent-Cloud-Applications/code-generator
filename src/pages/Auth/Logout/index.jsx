import { Auth } from 'aws-amplify'
import React, { useEffect } from 'react'
import institutionData from '../../../constants'

const Logout = () => {
  useEffect(() => {
    const onLoad = async () => {
      const domain = process.env.REACT_APP_STAGE === 'PROD' ?
      institutionData.BETA_DOMAIN : institutionData.BETA_DOMAIN;
      const client_id = process.env.REACT_APP_STAGE === 'PROD' ?
        process.env.REACT_APP_PROD_CLIENT_ID : process.env.REACT_APP_DEV_CLIENT_ID;
      const redirect = process.env.NODE_ENV === 'development' ?
        'http://localhost:3000' : process.env.REACT_APP_STAGE === 'PROD' ?
        institutionData.PROD_DOMAIN : institutionData.BETA_DOMAIN;

      try {
        await Auth.signOut();
        // await fetch(`https://${domain}/logout?client_id=${client_id}&&redirect_uri=${redirect}&&response_type=code`, {
        await fetch(`https://${domain}/logout?client_id=${client_id}&&logout_uri=${redirect}`, {
          redirect: 'follow',
          mode: 'no-cors',
        });
        window.location.href = '/'
      } catch (e) {
        console.log(e)
      }
    }

    onLoad();
  }, [])

  return <div>Logging out...</div>
}

export default Logout
