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
        userPoolId: process.env.REACT_APP_DEV_USER_POOL_ID,
        identityPoolId: process.env.REACT_APP_DEV_IDENTITY_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_DEV_CLIENT_ID,
        oauth: {
            domain: 'intellegent-google.auth.us-east-2.amazoncognito.com',
            scope: ['openid', 'email'],
            redirectSignIn: 'http://localhost:3000/redirect',
            redirectSignOut: 'http://localhost:3000',
            responseType: 'code',
        }
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
                // endpoint: 'https://r5dp21mb28.execute-api.us-east-2.amazonaws.com/dev',
                endpoint: 'https://ikticbkaxh.execute-api.us-east-2.amazonaws.com/dev',
                region: 'us-east-2',
            },
            {
                name: 'prod',
                endpoint: 'https://xc5rnclqr6.execute-api.us-east-1.amazonaws.com/dev',
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
