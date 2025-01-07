const institutionName = 'happyprancer'; // Change this variable to configure for different institutions

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
            cloudfrontId: 'E263LXOGXF3H0N'            // CloudFront distribution ID for the beta environment
        },
        // Configuration for the production environment
        [institutionName]: {
            s3Bucket: `${institutionName}.com`,        // Name of the S3 bucket where the production frontend is deployed
            cloudfrontId: 'E470TC368F952'             // CloudFront distribution ID for the production environment
        }
    }
};

export default institutionData;