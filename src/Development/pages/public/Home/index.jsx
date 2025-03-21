import Header from "../../../components/Header";
import Hero from "./Hero";
import Perks from "./Perks";
import Testimonials from "./Testimonials";
import Subscriptions from "./Subscriptions";
import FAQs from "./FAQs";
import Footer from "../../../components/Footer";
import {Auth} from "aws-amplify";
import {useEffect} from "react";
import config from "../../../config";
import {jwtDecode} from "jwt-decode";

function Home() {
  async function initializeGoogleOneTap() {
    try {
      await Auth.currentAuthenticatedUser();
      window.google.accounts.id.cancel();
    } catch (error) {
      console.log(error);

      window.google.accounts.id.initialize({
        client_id: "132743944863-n6trjig5u2104014e3d7u41vtq3odeib.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        prompt_parent_id: "google-one-tap-container", // Optional
        cancel_on_tap_outside: false,
      });

      window.google.accounts.id.prompt(); // Shows the One Tap UI
    }

  }

  async function handleCredentialResponse(response) {
    console.log("Google Token:", response.credential);

    try {
      const googleIdToken = response.credential;
      const cognitoDomain = `https://${config.Auth.oauth.domain}`;
      const clientId = config.Auth.userPoolWebClientId;
      const redirectUri = config.Auth.oauth.redirectSignIn;
      const decodedToken = await jwtDecode(response.credential);

      const authorizeUrl = `${cognitoDomain}/oauth2/authorize?` + new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: redirectUri,
        identity_provider: "Google",
        id_token: googleIdToken,
        scope: "openid profile email",
        login_hint: decodedToken.email
      });

      window.location.href = authorizeUrl;
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  }

  useEffect(() => {
    initializeGoogleOneTap();
  }, []);

  return (
    <div className={` overflow-hidden`}>
      <Header/>
      <div
        id="google-one-tap-container"
        className="fixed top-24 right-4 z-50 flex items-center justify-center"
      ></div>
      <Hero/>
      <Perks/>
      <Testimonials/>
      <Subscriptions/>
      <FAQs/>
      <Footer/>
    </div>
  );
}

export default Home;
