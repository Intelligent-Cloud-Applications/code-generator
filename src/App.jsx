import { useContext, useEffect, useRef, useState } from "react";
import { Auth, API } from "aws-amplify";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Context from "./Development/Context/Context";
import RoutesContainer from "./Development/routes";
import LoaderProvider from "./Development/components/LoaderProvider";
import InstitutionContext from "./Development/Context/InstitutionContext";
import apiPaths from "./Development/utils/api-paths";
import { jwtDecode } from "jwt-decode";
import institutionData from "./Development/constants";

function App() {
  const UtilCtx = useRef(useContext(Context).util);
  const RefCtx = useRef(useContext(Context));
  const RefInstitutionCtx = useRef(useContext(InstitutionContext));
  const InstitutionCtx = useContext(InstitutionContext);
  
  // State for dynamic meta data
  const [metaData, setMetaData] = useState({
    title: institutionData.seo?.title || '',
    description: institutionData.seo?.description || '',
    keywords: institutionData.seo?.keywords || '',
    companyName: institutionData.institution || ''
  });

  const getCompanyName = () => {
    return metaData.companyName.charAt(0).toUpperCase() + metaData.companyName.slice(1);
  };

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
          "main",
          `/any/get-institution-data/${institutionData.InstitutionId}`
        );
        data.InstitutionId = data.institutionid;

        // Set favicon dynamically
        setFavicon(data.logoUrl);

        // Update meta data based on institution data
        setMetaData({
          title: data.seo?.title || data.companyName || institutionData.seo?.title,
          description: data.seo?.description || institutionData.seo?.description,
          keywords: data.seo?.keywords || institutionData.seo?.keywords,
          companyName: data.companyName || institutionData.institution
        });

        // Set CSS variables
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
      }
    };

    dataLoadFn();
  }, []);

  // Verify meta tags are set properly
  useEffect(() => {
    const verifyMetaTags = () => {
      const currentTags = {
        title: document.querySelector('meta[name="title"]')?.content,
        description: document.querySelector('meta[name="description"]')?.content,
        keywords: document.querySelector('meta[name="keywords"]')?.content
      };
      
      console.log('Current Meta Tags:', currentTags);
    };

    // Check after a delay to ensure React-Helmet has updated
    setTimeout(verifyMetaTags, 1000);
  }, [metaData]);

  return (
    <HelmetProvider>
      <Helmet>
        {/* Dynamic document title */}
        <title>{`Welcome to ${getCompanyName()}`}</title>
        
        {/* Dynamic meta tags */}
        <meta name="title" content={metaData.title} />
        <meta name="description" content={metaData.description} />
        <meta 
          name="keywords" 
          content={Array.isArray(metaData.keywords) 
            ? metaData.keywords.join(', ') 
            : metaData.keywords} 
        />
        
        {/* GTM Script */}
        {institutionData.GTM_ID && (
          <script>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${institutionData.GTM_ID}');
            `}
          </script>
        )}
      </Helmet>

      {/* GTM NoScript */}
      {institutionData.GTM_ID && (
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${institutionData.GTM_ID}`}
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}

      <LoaderProvider>
        {InstitutionCtx.institutionData && <RoutesContainer />}
      </LoaderProvider>
    </HelmetProvider>
  );
}

export default App;
