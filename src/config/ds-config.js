export const dsProd = {
    Auth: {
        mandatorySignIn: true,
        region: 'us-east-1',
        userPoolId: process.env.REACT_APP_PROD_USER_POOL_ID,
        identityPoolId: process.env.REACT_APP_PROD_IDENTITY_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_PROD_CLIENT_ID,
        oauth: { responseType: 'token' },
    },
    Storage: {
        region: 'us-east-1',
        bucket: 'insitution-utils',
        identityPoolId: process.env.REACT_APP_PROD_IDENTITY_POOL_ID,
    },
    API: {
        endpoints: [
            {
                name: 'main',
                // endpoint: 'https://xc5rnclqr6.execute-api.us-east-1.amazonaws.com/dev',
                endpoint: 'https://ozmwa310vk.execute-api.us-east-1.amazonaws.com/dev',
                region: 'us-east-1',
            },
            {
                name: 'prod',
                // endpoint: 'https://xc5rnclqr6.execute-api.us-east-1.amazonaws.com/dev',
                endpoint: 'https://ozmwa310vk.execute-api.us-east-1.amazonaws.com/dev',
                region: 'us-east-1',
            },
            {
                name: 'awsaiapp',
                endpoint: 'https://er9zh7i7md.execute-api.us-east-1.amazonaws.com/dev',
                region: 'us-east-1',
            }
        ]
    }
}

export const dsDev = {
    Auth: {
        mandatorySignIn: true,
        region: 'us-east-2',
        userPoolId: 'us-east-2_J02pfxenV',
        identityPoolId: 'us-east-2:2966c931-c163-4682-89d6-9bf8c491e5b7',
        userPoolWebClientId: '1oui8eijud46ajipjeg01h4i3m',
        // oauth: { responseType: 'token' },
    },
    Storage: {
        region: 'us-east-1',
        bucket: 'insitution-utils',
        identityPoolId: 'us-east-2:9b1fda39-3231-4606-b32f-7ba24edcb53d',
    },
    API: {
        endpoints: [
            {
                name: 'main',
                // endpoint: 'https://r5dp21mb28.execute-api.us-east-2.amazonaws.com/dev',
                endpoint: ' https://ikticbkaxh.execute-api.us-east-2.amazonaws.com/dev',
                region: 'us-east-2',
            },
            {
                name: 'prod',
                // endpoint: 'https://xc5rnclqr6.execute-api.us-east-1.amazonaws.com/dev',
                endpoint: ' https://ikticbkaxh.execute-api.us-east-2.amazonaws.com/dev',
                region: 'us-east-1',
            },
            {
                name: 'awsaiapp',
                endpoint: "https://er9zh7i7md.execute-api.us-east-1.amazonaws.com/dev",
                region: 'us-east-1',
            }
        ]
    }
}
