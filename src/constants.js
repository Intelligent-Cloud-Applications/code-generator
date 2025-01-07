const institutionName = 'happyprancer'; // Change this for different institutions

const institutionData = {
    BETA_DOMAIN: `https://beta.${institutionName}.com`,
    PROD_DOMAIN: `https://${institutionName}.com`,
    InstitutionId: institutionName,
    institution: institutionName,
    institutionType: 'ds',
    GTM_ID: 'GTM-5DW548R',
    deployment: {
        [`beta-${institutionName}`]: {  // Updated to use beta-institutionName format
            s3Bucket: `beta.${institutionName}.com`,
            cloudfrontId: 'E263LXOGXF3H0N'
        },
        [institutionName]: {  // This will use the institution name as the branch name
            s3Bucket: `${institutionName}.com`,
            cloudfrontId: 'E470TC368F952'
        }
    }
};

export default institutionData;