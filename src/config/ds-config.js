export const dsProd = {
    Auth: {
        mandatorySignIn: true,
        region: 'us-east-1',
        userPoolId: 'us-east-1_a3Fk5S3hh',
        identityPoolId: 'us-east-1:a68cac30-d7f7-4f73-9b1f-ca6a4f86eba6',
        userPoolWebClientId: 'jevucp6v2ehehqerq0rlgn4d8',
        oauth: { responseType: 'token' },
    },
    Storage: {
        region: 'us-east-1',
        bucket: 'insitution-utils',
        identityPoolId: 'us-east-1:a68cac30-d7f7-4f73-9b1f-ca6a4f86eba6',
    },
    API: {
        endpoints: [
            {
                name: 'main',
                endpoint: 'https://7sh8wrjmm2.execute-api.us-east-1.amazonaws.com/dev',
                region: 'us-east-1',
            },
            {
                name: 'prod',
                endpoint: 'https://7sh8wrjmm2.execute-api.us-east-1.amazonaws.com/dev',
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
        userPoolId: 'us-east-2_L3E5BSjIf',
        identityPoolId: 'us-east-2:9b1fda39-3231-4606-b32f-7ba24edcb53d',
        userPoolWebClientId: '5pqia04a65b3ef6fbmpoccj4vl',
        oauth: { responseType: 'token' },
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
                endpoint: 'https://r5dp21mb28.execute-api.us-east-2.amazonaws.com/dev',
                region: 'us-east-2',
            },
            {
                name: 'prod',
                endpoint: 'https://7sh8wrjmm2.execute-api.us-east-1.amazonaws.com/dev',
                region: 'us-east-1',
            },
            {
                name: 'awsaiapp',
                endpoint: "https://i8k00gfjyf.execute-api.us-east-2.amazonaws.com/dev",
                region: 'us-east-2',
            }
        ]
    }
}