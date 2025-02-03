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
  const InstitutionData = InstitutionCtx.institutionData;

  // State for dynamic meta data
  const [metaData, setMetaData] = useState({
    title: InstitutionData?.title || institutionData.seo?.title || '',
    description: InstitutionData?.description || institutionData.seo?.description || '',
    keywords: institutionData.seo?.keywords || '',
    companyName: institutionData.institution || ''
  });

  // Capitalize the company name
  const getCompanyName = () => {
    return metaData.companyName
      ? metaData.companyName.charAt(0).toUpperCase() + metaData.companyName.slice(1)
      : '';
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

        // Set institution data in context
        RefInstitutionCtx.current.setInstitutionData(data);
        RefCtx.current.onUnauthLoad(data.InstitutionId);

        // Ensure metadata updates dynamically
        setMetaData((prev) => {
          const newTitle = `Welcome to ${data.title || getCompanyName()}`;
          const newDescription = data.description || institutionData.seo?.description || '';

          if (prev.title !== newTitle || prev.description !== newDescription) {
            return {
              title: newTitle,
              description: newDescription,
              keywords: data.seo?.keywords || institutionData.seo?.keywords || '',
              companyName: data.companyName || institutionData.institution || ''
            };
          }
          return prev; // No changes, avoid re-render
        });

        // Set CSS variables for theming
        document.documentElement.style.setProperty("--color-primary", data.PrimaryColor);
        document.documentElement.style.setProperty("--color-secondary", data.SecondaryColor);
        document.documentElement.style.setProperty("--color-light-primary", data.LightPrimaryColor);
        document.documentElement.style.setProperty("--color-lightest-primary", data.LightestPrimaryColor);

      } catch (e) {
        console.error("Error loading institution data:", e);
      }
    };

    dataLoadFn();
  }, []);

  // ✅ Update metadata when InstitutionData changes
  useEffect(() => {
    if (InstitutionData) {
      setMetaData((prev) => {
        const newTitle = `Welcome to ${InstitutionData?.title || getCompanyName()}`;
        const newDescription = InstitutionData?.description || institutionData.seo?.description || '';

        if (prev.title !== newTitle || prev.description !== newDescription) {
          return {
            title: newTitle,
            description: newDescription,
            keywords: InstitutionData?.seo?.keywords || institutionData.seo?.keywords || '',
            companyName: InstitutionData?.institution || institutionData.institution || ''
          };
        }
        return prev;
      });
    }
  }, [InstitutionData]); 

  return (
    <HelmetProvider>
      <Helmet>
        {/* Dynamic document title */}
        <title>{`Welcome to ${metaData.companyName}`}</title>

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
