export const configDev = {
  aws_project_region: 'eu-west-1',
  aws_appsync_graphqlEndpoint:
    'https://r3wnlhc6kfe4xbl42xh4xecjyq.appsync-api.eu-west-1.amazonaws.com/graphql',
  aws_appsync_region: 'eu-west-1',
  aws_appsync_authenticationType: 'AWS_IAM',
  aws_appsync_apiKey: 'da2-vfyfapxfzzcd5fau56wo7uwxnq',
  aws_cloud_logic_custom: [
    {
      name: 'heliomerchant',
      endpoint: 'https://0p104a9qb6.execute-api.eu-west-1.amazonaws.com/test',
      region: 'eu-west-1',
    },
  ],
  aws_cognito_identity_pool_id:
    'eu-west-1:12b8fde5-3589-40d3-b0c1-250c17640b20',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_Pqzmf5hKU',
  aws_user_pools_web_client_id: '73ib9ts9qlgjf1nnib6rucs0bq',
  oauth: {},
  aws_cognito_username_attributes: [],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['EMAIL'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
  aws_user_files_s3_bucket: 'helioimages153344-test',
  aws_user_files_s3_bucket_region: 'eu-west-1',
};
export const configProd = {
  aws_project_region: 'eu-west-1',
  aws_appsync_graphqlEndpoint:
    'https://lxgvhcb6dvct5h4dqvgwiz6swq.appsync-api.eu-west-1.amazonaws.com/graphql',
  aws_appsync_region: 'eu-west-1',
  aws_appsync_authenticationType: 'AWS_IAM',
  aws_appsync_apiKey: 'da2-25sdd73hhratnpvwt7y2czvv4i',
  aws_cloud_logic_custom: [
    {
      name: 'heliomerchant',
      endpoint: 'https://g5038e1jdg.execute-api.eu-west-1.amazonaws.com/prod',
      region: 'eu-west-1',
    },
  ],
  aws_cognito_identity_pool_id:
    'eu-west-1:d0445e5a-74c6-4d56-979f-d375ded2a84e',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_haNS4qdNc',
  aws_user_pools_web_client_id: '5mip23calvcl3q1u8dpsojjvc7',
  oauth: {},
  aws_cognito_username_attributes: [],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['EMAIL'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
  aws_user_files_s3_bucket: 'helioimages113109-prod',
  aws_user_files_s3_bucket_region: 'eu-west-1',
};
