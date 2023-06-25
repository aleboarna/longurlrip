import { App } from 'aws-cdk-lib';
import { ApiStack } from '../../src/lib/api-stack';
import { Match, Matcher, Template } from 'aws-cdk-lib/assertions';

test('ApiStack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new ApiStack(app, 'ApiStack', {
    projectName: 'testProject',
    stackEnv: 'testEnv',
    domainName: 'domainName',
    domainCertificate: 'domainNameCertificate',
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
    Description: 'This is the main API for project.',
    Name: 'testProject-API-testEnv',
    ProtocolType: 'HTTP',
  });

  template.hasResourceProperties(
    'AWS::ApiGatewayV2::Integration',
    Match.objectEquals({
      ApiId: {
        Ref: Match.anyValue(),
      },
      IntegrationType: 'AWS_PROXY',
      IntegrationUri:
        'arn:aws:lambda:us-east-1:123456789012:function:testProject-API-testEnv:testEnv',
      PayloadFormatVersion: '2.0',
    })
  );

  template.resourceCountIs('AWS::Lambda::Permission', 1);

  template.hasResourceProperties(
    'AWS::ApiGatewayV2::Route',
    Match.objectEquals({
      ApiId: {
        Ref: Match.anyValue(),
      },
      RouteKey: '$default',
      AuthorizationType: 'NONE',
      Target: Match.anyValue(),
    })
  );

  template.hasResourceProperties(
    'AWS::ApiGatewayV2::Stage',
    Match.objectEquals({
      ApiId: {
        Ref: Match.anyValue(),
      },
      StageName: '$default',
      AutoDeploy: true,
    })
  );

  template.hasResourceProperties(
    'AWS::ApiGatewayV2::DomainName',
    Match.objectEquals({
      DomainName: 'api.domainName',
      DomainNameConfigurations: [
        {
          CertificateArn: Match.anyValue(),
          EndpointType: 'REGIONAL',
        },
      ],
    })
  );

  template.hasResourceProperties(
    'AWS::ApiGatewayV2::ApiMapping',
    Match.objectEquals({
      ApiId: {
        Ref: Match.anyValue(),
      },
      DomainName: {
        Ref: Match.anyValue(),
      },
      Stage: '$default',
    })
  );

  template.hasResourceProperties(
    'AWS::Route53::RecordSet',
    Match.objectEquals({
      Name: 'api.domainName.',
      Type: 'A',
      AliasTarget: {
        DNSName: {
          'Fn::GetAtt': [Match.anyValue(), 'RegionalDomainName'],
        },
        HostedZoneId: {
          'Fn::GetAtt': [Match.anyValue(), 'RegionalHostedZoneId'],
        },
      },
      HostedZoneId: Match.anyValue(),
    })
  );
});
