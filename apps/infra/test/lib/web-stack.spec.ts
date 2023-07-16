import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { WebStack } from '../../src/lib/web-stack';

test('WebStack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new WebStack(app, 'WebStack', {
    projectName: 'testProject',
    stackEnv: 'testEnv',
    domainName: 'domainName',
    domainCertificateWeb: 'domainNameCertificate',
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'testproject-web-testenv',
    VersioningConfiguration: {
      Status: 'Enabled',
    },
  });
  template.hasResourceProperties(
    'AWS::S3::BucketPolicy',
    Match.objectEquals({
      Bucket: {
        Ref: Match.anyValue(),
      },
      PolicyDocument: {
        Statement: [
          {
            Action: ['s3:GetBucket*', 's3:List*', 's3:DeleteObject*'],
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::GetAtt': [Match.anyValue(), 'Arn'],
              },
            },
            Resource: [
              {
                'Fn::GetAtt': [Match.anyValue(), 'Arn'],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [Match.anyValue(), 'Arn'],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
          {
            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
            Effect: 'Allow',
            Principal: {
              CanonicalUser: {
                'Fn::GetAtt': [Match.anyValue(), 'S3CanonicalUserId'],
              },
            },
            Resource: [
              {
                'Fn::GetAtt': [Match.anyValue(), 'Arn'],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [Match.anyValue(), 'Arn'],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
          {
            Action: 's3:GetObject',
            Effect: 'Allow',
            Principal: {
              CanonicalUser: {
                'Fn::GetAtt': [Match.anyValue(), 'S3CanonicalUserId'],
              },
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [Match.anyValue(), 'Arn'],
                  },
                  '/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    })
  );
  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        },
      ],
    },
    ManagedPolicyArns: [
      {
        'Fn::Sub':
          'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      },
    ],
  });
  template.hasResourceProperties(
    'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'Allows CloudFront to reach the bucket',
      },
    }
  );
  template.hasResourceProperties(
    'AWS::CloudFront::Distribution',
    Match.objectEquals({
      DistributionConfig: {
        Aliases: ['domainName'],
        DefaultCacheBehavior: {
          AllowedMethods: ['GET', 'HEAD'],
          CachedMethods: ['GET', 'HEAD'],
          Compress: true,
          ForwardedValues: {
            Cookies: {
              Forward: 'none',
            },
            QueryString: false,
          },
          TargetOriginId: 'origin1',
          ViewerProtocolPolicy: 'redirect-to-https',
        },
        DefaultRootObject: 'index.html',
        Enabled: true,
        HttpVersion: 'http2',
        IPV6Enabled: true,
        Origins: [
          {
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            DomainName: {
              'Fn::GetAtt': [Match.anyValue(), 'RegionalDomainName'],
            },
            Id: 'origin1',
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Join': [
                  '',
                  [
                    'origin-access-identity/cloudfront/',
                    {
                      Ref: Match.anyValue(),
                    },
                  ],
                ],
              },
            },
          },
        ],
        PriceClass: 'PriceClass_100',
        ViewerCertificate: {
          AcmCertificateArn: Match.anyValue(),
          SslSupportMethod: 'sni-only',
        },
      },
    })
  );
});
