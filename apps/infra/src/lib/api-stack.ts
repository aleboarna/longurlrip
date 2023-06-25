import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as api from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Arn } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiMapping, DomainName } from '@aws-cdk/aws-apigatewayv2-alpha';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayv2DomainProperties } from 'aws-cdk-lib/aws-route53-targets';
export interface IApiProps extends cdk.StackProps {
  readonly projectName: string;
  readonly domainName: string;
  readonly domainCertificate: string;
  readonly stackEnv: string;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IApiProps) {
    super(scope, id, props);

    const { projectName, domainName, domainCertificate, stackEnv } = props;

    // import lambda based on arn
    const apiLambda = lambda.Function.fromFunctionArn(
      this,
      `${projectName}-API-Lambda-Import-${stackEnv}`,
      `arn:aws:lambda:${this.region}:${this.account}:function:${projectName}-API-${stackEnv}:${stackEnv}`
    );

    // create API GW lambda integration object
    const lambdaIntegration = new HttpLambdaIntegration(
      `${projectName}-Api-Lambda-Integration-${stackEnv}`,
      apiLambda
    );

    // create HTTP API GW using L3 construct with $default integration on above imported lambda
    const httpApi = new api.HttpApi(
      this,
      `${projectName}-HttpApi-${stackEnv}`,
      {
        apiName: `${projectName}-API-${stackEnv}`,
        description: `This is the main API for project.`,
        defaultIntegration: lambdaIntegration,
      }
    );

    // import the ACM SSL certificate for the env TLD domain
    const certificate = Certificate.fromCertificateArn(
      this,
      `${projectName}-APIGW-ACM-${stackEnv}`,
      `arn:aws:acm:${this.region}:${this.account}:certificate/${domainCertificate}`
    );

    // create HTTP API GW domain
    const domainNameTLD = new DomainName(
      this,
      `${projectName}-APIGW-Domain-TLD-${stackEnv}`,
      {
        domainName: `api.${domainName}`,
        certificate,
      }
    );

    // map domain to HTTP API
    const tldMapping = new ApiMapping(
      this,
      `${projectName}-Api-Mapping-TLD-${stackEnv}`,
      {
        api: httpApi,
        domainName: domainNameTLD,
      }
    );

    tldMapping.node.addDependency(domainNameTLD);

    // import Route53 zone for domain
    const zone = HostedZone.fromLookup(
      this,
      `${projectName}-R53-Zone-${stackEnv}`,
      {
        domainName,
      }
    );

    // create alias record to API GW domain
    new ARecord(this, `${projectName}-R53-A-${stackEnv}`, {
      zone,
      recordName: 'api',
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(
          domainNameTLD.regionalDomainName,
          domainNameTLD.regionalHostedZoneId
        )
      ),
    });
  }
}
