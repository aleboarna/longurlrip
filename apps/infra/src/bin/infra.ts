#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/api-stack';
import { PROJECT_NAME } from '../config';
import { LambdaStack } from '../lib/lambda-stack';
import { DbStack } from '../lib/db-stack';
import { WebStack } from '../lib/web-stack';

const app = new cdk.App();
const domainName = app.node.tryGetContext('domainName');
const domainCertificateApi = app.node.tryGetContext('domainCertificateApi');
const domainCertificateWeb = app.node.tryGetContext('domainCertificateWeb');
const stackEnv = app.node.tryGetContext('stackEnv');

const api = new ApiStack(app, `${PROJECT_NAME}-API-${stackEnv}`, {
  // https://docs.aws.amazon.com/cdk/v2/guide/environments.html
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  projectName: PROJECT_NAME,
  description: `Contains the API tier resources`,
  domainName,
  domainCertificateApi,
  stackEnv,
});

const lambda = new LambdaStack(app, `${PROJECT_NAME}-Lambda-API-${stackEnv}`, {
  // https://docs.aws.amazon.com/cdk/v2/guide/environments.html
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  projectName: PROJECT_NAME,
  description: 'Contains the API backend tier resources',
  stackEnv,
});

const db = new DbStack(app, `${PROJECT_NAME}-DB-${stackEnv}`, {
  // https://docs.aws.amazon.com/cdk/v2/guide/environments.html
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  projectName: PROJECT_NAME,
  description: 'Contains the DB tier resources',
  stackEnv,
});

const web = new WebStack(app, `${PROJECT_NAME}-Web-${stackEnv}`, {
  // https://docs.aws.amazon.com/cdk/v2/guide/environments.html
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  projectName: PROJECT_NAME,
  description: `Contains the Web tier resources`,
  domainName,
  domainCertificateWeb,
  stackEnv,
});
