import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Environment } from 'aws-cdk-lib';

export const lambdaApiPermissions = (
  projectName: string,
  stackEnv: string,
  env: Environment
) => [
  new PolicyStatement({
    resources: [
      `arn:aws:dynamodb:${env.region}:${env.account}:table/${projectName}-Slugs-${stackEnv}`,
    ],
    actions: ['dynamodb:GetItem', 'dynamodb:PutItem'],
  }),
];
