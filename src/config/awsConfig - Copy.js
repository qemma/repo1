// DEV ENV
// export const AwsConfig = {
//   Auth: {
//     // REQUIRED - Amazon Cognito Identity Pool ID
//     identityPoolId: 'eu-west-1:d306d8e5-a388-4485-be9f-6e6b20614ea0',
//     // REQUIRED - Amazon Cognito Region
//     region: 'eu-west-1',
//     // OPTIONAL - Amazon Cognito User Pool ID
//     userPoolId: 'eu-west-1_drMzeE6EJ',
//     // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
//     userPoolWebClientId: '3il27i9v9cj8lb2gqckntnpcgn',
//     mandatorySignIn: true
//   },
//   API: {
//     endpoints: [
//       {
//         name: 'piramisApi',
//         endpoint: 'https://4c83rj7ij1.execute-api.eu-west-1.amazonaws.com/dev',
//         // endpoint: 'http://localhost:3000',
//         service: 'lambda',
//         region: 'eu-west-1'
//       }
//     ]
//   },
//   Storage: {
//     bucket: 'dev-piramisbucket', //REQUIRED -  Amazon S3 bucket
//     region: 'eu-west-1' //OPTIONAL -  Amazon service region
//   }
// };

//MKI
export const AwsConfig = {
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'eu-west-2:3675275f-192b-4a66-b1a9-8d68b91e9b83',
    // REQUIRED - Amazon Cognito Region
    region: 'eu-west-2',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-west-2_RgbnigTnV',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '1pipv1u77bemlmphhfa3902v',
    mandatorySignIn: true
  },
  API: {
    endpoints: [
      {
        name: 'piramisApi',
        endpoint: 'https://8npu4znktd.execute-api.eu-west-2.amazonaws.com/mki',
        //endpoint: 'http://localhost:3000',
        service: 'lambda',
        region: 'eu-west-2'
      }
    ]
  }
};
