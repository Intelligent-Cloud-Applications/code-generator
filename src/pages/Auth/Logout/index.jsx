import { Auth } from 'aws-amplify'
import React, { useEffect } from 'react'

const Logout = () => {
  useEffect(() => {
    const onLoad = async () => {
      try {
        await Auth.signOut();
        await fetch('https://intellegent-google.auth.us-east-2.amazoncognito.com/logout?client_id=3bmq186gvs0u1pj9c8cum6ffl2&&redirect_uri=http://localhost:3000&&response_type=code', {
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
