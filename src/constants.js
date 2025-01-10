// constants.js
let data = {};
let metaTags = {};

// Helper function to safely parse JSON with better error handling
const safeJSONParse = (envVar, varName) => {
    try {
        if (!envVar) {
            console.warn(`${varName} is not defined in environment variables`);
            return {};
        }
        return JSON.parse(envVar);
    } catch (error) {
        console.error(`Error parsing ${varName}:`, error);
        console.log('Raw value:', envVar);
        return {};
    }
};

// Parse environment variables
data = safeJSONParse(process.env.REACT_APP_INSTITUTION_DATA, 'REACT_APP_INSTITUTION_DATA');
metaTags = safeJSONParse(process.env.REACT_APP_META_TAGS, 'REACT_APP_META_TAGS');

// Destructure with default value to prevent undefined
const { institutionId = '' } = data;

function splitInstitutionId() {
    if (!institutionId) {
        console.warn('institutionId is empty or undefined');
        return { institution: '', id: '' };
    }
    const parts = institutionId.split(/(\d+)/).filter(Boolean);
    return {
        institution: parts[0] || '',
        id: parts[1] || '',
    };
}

const result = splitInstitutionId();
const institutionName = result.institution;

const institutionData = {
    BETA_DOMAIN: institutionName ? `https://beta.${institutionName}.com` : '',
    PROD_DOMAIN: institutionName ? `https://${institutionName}.com` : '',
    InstitutionId: institutionName,
    institution: institutionName,
    institutionType: 'ds',
    GTM_ID: metaTags.gtmId,
    deployment: institutionName ? {
        [`beta-${institutionName}`]: {
            s3Bucket: `beta.${institutionName}.com`,
            cloudfrontId: data.cloudFrontId,
        },
        [institutionName]: {
            s3Bucket: `${institutionName}.com`,
            cloudfrontId: data.cloudFrontId,
        },
    } : {},
    seo: {
        title: metaTags.title || '',
        description: metaTags.description || '',
        keywords: metaTags.keywords || [],
    },
};

export default institutionData;