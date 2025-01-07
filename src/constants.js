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
            s3Bucket: `beta${institutionName}.awsaiapp.com`,
            cloudfrontId: 'E36I0B4BJRQ8X'
        },
        [institutionName]: {  // This will use the institution name as the branch name
            s3Bucket: `${institutionName}.awsaiapp.com`,
            cloudfrontId: 'E470TC368F952'
        }
    }
};

export default institutionData;