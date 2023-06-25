import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { lambdaApiPermissions } from '../config/lambda-permissions';

export interface ILambdaProps extends cdk.StackProps {
  readonly projectName: string;
  readonly stackEnv: string;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ILambdaProps) {
    super(scope, id, props);

    const { env, projectName, stackEnv } = props;

    // create an lambda to hold the api
    const apiLambda = new lambda.Function(
      this,
      `${projectName}-API-${stackEnv}`,
      {
        code: lambda.Code.fromAsset(
          join(__dirname, `../../../../dist/apps/api`)
        ),
        architecture: lambda.Architecture.ARM_64,
        handler: `lambda.handler`,
        runtime: lambda.Runtime.NODEJS_18_X,
        functionName: `${projectName}-API-${stackEnv}`,
        description: `This communicates with the HTTP API`,
        timeout: Duration.seconds(5),
        initialPolicy: lambdaApiPermissions(projectName, stackEnv, env!),
        // create a lambda snapshot of all configuration in a version so it can be referenced in the alias that is used in the API
        // this allows us to quickly rollback to previous version if there is an issue with the deployment
        currentVersionOptions: {
          removalPolicy: RemovalPolicy.RETAIN,
          retryAttempts: 1,
        },
        environment: {
          PROJECT_NAME: projectName,
          APP_MEMORY_CLASS: 'dynamodb',
          ENV: stackEnv,
        },
      }
    );

    const apiLambdaAlias = new lambda.Alias(
      this,
      `${projectName}-API-Alias-${stackEnv}`,
      {
        aliasName: stackEnv,
        version: apiLambda.currentVersion,
      }
    );
  }
}
