import data from './data.json';  // Importing data for institution details
import metaTags from './metatags.json'; // Importing meta tags dynamically

const { institutionId } = data; // Extract institutionId
function splitInstitutionId() {
    const parts = institutionId.split(/(\d+)/).filter(Boolean); // Split into text and numbers
    return {
        institution: parts[0], // The text portion
        id: parts[1] // The numeric portion
    };
}

// Usage
const result = splitInstitutionId();

const institutionName = result.institution; // Change this variable to configure for different institutions

const institutionData = {
    BETA_DOMAIN: `https://beta.${institutionName}.com`, // Beta environment URL
    PROD_DOMAIN: `https://${institutionName}.com`,      // Production environment URL
    InstitutionId: institutionName,
    institution: institutionName,
    institutionType: 'ds',
    GTM_ID: metaTags.gtmId,                             // Dynamic Google Tag Manager ID
    deployment: {
        // Configuration for the beta environment
        [`beta-${institutionName}`]: {
            s3Bucket: `beta.${institutionName}.com`,   // Name of the S3 bucket where the beta frontend is deployed
            cloudfrontId: data.cloudFrontId            // CloudFront distribution ID for the beta environment
        },
        // Configuration for the production environment
        [institutionName]: {
            s3Bucket: `${institutionName}.com`,        // Name of the S3 bucket where the production frontend is deployed
            cloudfrontId: data.cloudFrontId            // CloudFront distribution ID for the production environment
        }
    },
    // change these SEO meta tags according to the institutions
    seo: {
        title: metaTags.title,         // Dynamic title
        description: metaTags.description, // Dynamic description
        keywords: metaTags.keywords    // Dynamic keywords
    }
};

export default institutionData;
