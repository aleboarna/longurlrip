import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  Table,
  TableEncryption,
} from 'aws-cdk-lib/aws-dynamodb';

export interface IDbProps extends cdk.StackProps {
  readonly projectName: string;
  readonly stackEnv: string;
}

export class DbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IDbProps) {
    super(scope, id, props);

    const { projectName, stackEnv } = props;

    const dbSlugs = new Table(
      this,
      `${projectName}-Gateway-Configuration-${stackEnv}`,
      {
        tableName: `${projectName}-Slugs-${stackEnv}`,
        partitionKey: { name: 'slug', type: AttributeType.STRING },
        readCapacity: 5,
        writeCapacity: 5,
        encryption: TableEncryption.AWS_MANAGED,
        billingMode: BillingMode.PROVISIONED,
        removalPolicy:
          stackEnv === 'PROD' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      }
    );
  }
}
