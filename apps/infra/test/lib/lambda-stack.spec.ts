import { App } from 'aws-cdk-lib';
import { LambdaStack } from '../../src/lib/lambda-stack';
import { Match, Template } from 'aws-cdk-lib/assertions';

test('LambdaStack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new LambdaStack(app, 'LambdaStack', {
    projectName: 'testProject',
    stackEnv: 'testEnv',
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: 'testProject-API-testEnv',
    Handler: 'lambda.handler',
    Runtime: 'nodejs18.x',
    Timeout: 5,
    Environment: {
      Variables: {
        PROJECT_NAME: 'testProject',
        APP_MEMORY_CLASS: 'dynamodb',
        ENV: 'testEnv',
      },
    },
  });

  template.hasResourceProperties(
    'AWS::Lambda::Alias',
    Match.objectEquals({
      FunctionName: {
        Ref: Match.anyValue(),
      },
      FunctionVersion: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      Name: 'testEnv',
    })
  );
});
