import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

export interface IWebProps extends cdk.StackProps {
  readonly projectName: string;
  readonly stackEnv: string;
  readonly domainName: string;
  readonly domainCertificateWeb: string;
}

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IWebProps) {
    super(scope, id, props);

    const { domainName, domainCertificateWeb, projectName, stackEnv } = props;

    // create an S3 bucket
    const bucketWeb = new s3.Bucket(this, `${projectName}-S3-Web-${stackEnv}`, {
      bucketName: `${projectName.toLowerCase()}-web-${stackEnv.toLowerCase()}`,
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // create a CloudFront origin access identity
    const oai = new cloudfront.OriginAccessIdentity(
      this,
      `${projectName}-CDN-OAI-Web-${stackEnv}`
    );

    // grant the OAI permission to read from the bucket
    bucketWeb.grantRead(oai);

    // import SSL cert from ACM
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      `${projectName}-CDN-ACM-${stackEnv}`,
      `arn:aws:acm:us-east-1:${this.account}:certificate/${domainCertificateWeb}`
    );

    // create a CloudFront distribution that uses the S3 bucket as an origin
    const webDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      `${projectName}-CDN-Web-${stackEnv}`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucketWeb,
              originAccessIdentity: oai,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        // we are hosting a SPA on / so any other path will return 404 not found, so we redirect to / always
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
        // cert needed to have SSL on domain we attach
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,
          {
            aliases: [domainName],
          }
        ),
      }
    );

    // import Route53 zone for domain
    const zone = route53.HostedZone.fromLookup(
      this,
      `${projectName}-R53-Zone-${stackEnv}`,
      {
        domainName,
      }
    );

    // create a DNS record pointing to the CloudFront distribution
    new route53.ARecord(this, `${projectName}-CDN-R53-Target-${stackEnv}`, {
      zone: zone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new CloudFrontTarget(webDistribution)
      ),
    });

    // deploy built web files to bucket
    new s3deploy.BucketDeployment(this, `${projectName}-We`, {
      sources: [
        s3deploy.Source.asset(join(__dirname, `../../../../dist/apps/web`)),
      ],
      destinationBucket: bucketWeb,
    });
  }
}
