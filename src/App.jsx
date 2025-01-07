import { useContext, useEffect, useRef } from "react";
import { Auth, API } from "aws-amplify";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Context from "./Context/Context";
import RoutesContainer from "./routes";
import LoaderProvider from "./components/LoaderProvider";
import InstitutionContext from "./Context/InstitutionContext";
import apiPaths from "./utils/api-paths";
import { jwtDecode } from "jwt-decode";
import institutionData from "./utils/constants";

function App() {
  const UtilCtx = useRef(useContext(Context).util);
  const RefCtx = useRef(useContext(Context));
  const RefInstitutionCtx = useRef(useContext(InstitutionContext));
  const InstitutionCtx = useContext(InstitutionContext);

  // Initialize GTM
  useEffect(() => {
    // Remove existing GTM script if any
    const existingScript = document.querySelector('script[src*="googletagmanager"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and add new GTM script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${institutionData.GTM_ID}');
    `;
    document.head.appendChild(script);

    // Update noscript iframe
    const noscriptIframe = document.querySelector('noscript iframe');
    if (noscriptIframe) {
      noscriptIframe.src = `https://www.googletagmanager.com/ns.html?id=${institutionData.GTM_ID}`;
    }
  }, [institutionData.GTM_ID]);

  // Function to dynamically set the favicon
  const setFavicon = (logoUrl) => {
    if (!logoUrl) return;
    let link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = logoUrl;
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  useEffect(() => {
    const dataLoadFn = async () => {
      try {
        const data = await API.get(
          "prod",
          `/any/get-institution-data/${institutionData.InstitutionId}`
        );
        data.InstitutionId = data.institutionid;

        document.documentElement.style.setProperty(
          "--color-primary",
          data.PrimaryColor
        );
        document.documentElement.style.setProperty(
          "--color-secondary",
          data.SecondaryColor
        );
        document.documentElement.style.setProperty(
          "--color-light-primary",
          data.LightPrimaryColor
        );
        document.documentElement.style.setProperty(
          "--color-lightest-primary",
          data.LightestPrimaryColor
        );

        // Set the favicon dynamically
        setFavicon(data.logoUrl);

        RefInstitutionCtx.current.setInstitutionData(data);
        RefCtx.current.onUnauthLoad(data.InstitutionId);

        await check(data);
      } catch (e) {
        console.error("Error loading institution data:", e);
      }
    };

    const check = async (data) => {
      UtilCtx.current.setLoader(true);

      try {
        const cognito = await Auth.currentAuthenticatedUser();
        const attributes = jwtDecode(cognito.signInUserSession.idToken.jwtToken);

        const response = await API.post(
          "main",
          `/any/user-exists/${data.InstitutionId}`,
          {
            body: {
              userPoolId: cognito.pool.userPoolId,
              username: attributes.email,
            },
          }
        );

        if (!response.inInstitution) {
          await API.post("main", `/user/profile/${data.InstitutionId}`, {
            body: {
              userName: attributes.name,
              emailId: attributes.email,
            },
          });
        }

        const userdata = await API.get(
          "main",
          `/user/profile/${data && data.InstitutionId}`
        );
        const showBirthdayModal = await API.post(
          "main",
          `/user/birthday-message/${data && data.InstitutionId}`
        );

        const location = await API.get("main", apiPaths?.getUserLocation);

        RefCtx.current.setUserData((prev) => ({
          ...prev,
          ...userdata,
          location,
          showBirthdayModal,
        }));
        RefCtx.current.setIsAuth(true);
        UtilCtx.current.setLoader(false);
        RefCtx.current.onAuthLoad(true, data.InstitutionId);
      } catch (e) {
        console.error("Error checking user data:", e);
        RefCtx.current.setUserData({});
        UtilCtx.current.setLoader(false);
      } finally {
        UtilCtx.current.setLoader(true);
        if (RefCtx.current.userData["location"] === undefined) {
          const location = await API.get("main", apiPaths?.getUserLocation);
          RefCtx.current.setUserData((prev) => ({
            ...prev,
            location,
          }));
        }
        UtilCtx.current.setLoader(false);
      }
    };

    dataLoadFn();
  }, []);

  return (
    <HelmetProvider>
      {/* Dynamic Title */}
      <Helmet>
        <title>
          {`Welcome to ${
            InstitutionCtx.institutionData?.companyName
              ? InstitutionCtx.institutionData.companyName.charAt(0).toUpperCase() +
                InstitutionCtx.institutionData.companyName.slice(1)
              : "Institution" // Fallback string for undefined companyName
          }!`}
        </title>
      </Helmet>
      <LoaderProvider>
        {InstitutionCtx.institutionData && <RoutesContainer />}
      </LoaderProvider>
    </HelmetProvider>
  );
}

export default App;