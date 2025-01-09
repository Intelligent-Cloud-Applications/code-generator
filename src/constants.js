import data from 'data.json';  // This will work because of the symlink in node_modules

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
    GTM_ID: 'GTM-5DW548R',                             // Google Tag Manager ID (adjust as needed for the institution)
    deployment: {
        // Configuration for the beta environment
        [`beta-${institutionName}`]: {
            s3Bucket: `beta.${institutionName}.com`,   // Name of the S3 bucket where the beta frontend is deployed
            cloudfrontId: data.cloudFrontId            // CloudFront distribution ID for the beta environment
        },
        // Configuration for the production environment
        [institutionName]: {
            s3Bucket: `${institutionName}.com`,        // Name of the S3 bucket where the production frontend is deployed
            cloudfrontId: data.cloudFrontId,             // CloudFront distribution ID for the production environment
        }
    },
    // change these SEO meta tags according to the institutions
    seo: {
        title: 'Welcome to Happyprancer: Dance Your Way to Fun and Fitness!',
        description: 'Discover fun fitness at Happyprancer! Join our Zumba, Bollywood, and yoga classes online. Sign up today and let\'s dance, sweat, and celebrate your health!',
        keywords: 'happyprancer, dance fitness online, zumba classes, bollywood dance fitness, virtual yoga sessions, online dance workouts, inclusive fitness programs, home fitness classes, fun workout routines, live online fitness classes, calorie-burning dance workouts, accessible fitness for all, group dance fitness sessions, energetic dance workouts, fitness through dance, affordable online yoga, virtual yoga sessions, online yoga classes, wellness and dance, stress relief through movement, dance your way to fitness, community fitness classes, happyprancer fitness experience'
    }
};

export default institutionData;