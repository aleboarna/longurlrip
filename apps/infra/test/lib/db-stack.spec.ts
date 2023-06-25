import { App } from 'aws-cdk-lib';
import { DbStack } from '../../src/lib/db-stack';
import { Template } from 'aws-cdk-lib/assertions';

test('DbStack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new DbStack(app, 'TestStack', {
    projectName: 'testProject',
    stackEnv: 'testEnv',
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    TableName: 'testProject-Slugs-testEnv',
    KeySchema: [
      {
        AttributeName: 'slug',
        KeyType: 'HASH',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    SSESpecification: {
      SSEEnabled: true,
    },
  });
});
