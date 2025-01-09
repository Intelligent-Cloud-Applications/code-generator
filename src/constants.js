// constants.js
import data from './data.json';
import metaTags from './metatags.json';

const { institutionId } = data;
function splitInstitutionId() {
    const parts = institutionId.split(/(\d+)/).filter(Boolean);
    return {
        institution: parts[0],
        id: parts[1]
    };
}

const result = splitInstitutionId();
const institutionName = result.institution;

const institutionData = {
    BETA_DOMAIN: `https://beta.${institutionName}.com`,
    PROD_DOMAIN: `https://${institutionName}.com`,
    InstitutionId: institutionName,
    institution: institutionName,
    institutionType: 'ds',
    GTM_ID: metaTags.gtmId,
    deployment: {
        [`beta-${institutionName}`]: {
            s3Bucket: `beta.${institutionName}.com`,
            cloudfrontId: data.cloudFrontId
        },
        [institutionName]: {
            s3Bucket: `${institutionName}.com`,
            cloudfrontId: data.cloudFrontId
        }
    },
    seo: {
        title: metaTags.title,
        description: metaTags.description,
        keywords: metaTags.keywords
    }
};

export default institutionData;