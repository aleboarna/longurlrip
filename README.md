# longurl.rip

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)

## Table of Contents

* [Installation](#installation)
* [Core Actions](#core-actions)
  * [Linting](#linting)
  * [Testing](#testing)
  * [Building](#building)
  * [Running](#running)
  * [Deploying](#deploying)
* [Development](#development)
  * [Debugging](#debugging)
* [Historical Commands](#historical-commands)
* [TODO](#todo)
* [Diagrams](#diagrams)
  * [Architectural Diagram](#architectural-diagram)
  * 
## Installation

```shell
npm i
```

## Core Actions
### Linting
```shell
nx lint <project>
```

### Testing
```shell
nx test <project>
```

### Building
```shell
nx build <project>
```

For `API` we have `build:express` & `build:lambda` to build for deployment on Docker or on serverless Lambda/Cloud Functions etc.

### Running
```shell
nx serve <project>
```

### Deploying
```shell
stackENV=<en> domainName=<domainName> domainNameCertificate=<cert_id> nx deploy infra
```

## Development
You can start local development of all dependencies and components by running
```shell
docker compose up
```
or by running the included IntelliJ Run Configuration
`[Docker] Up`
### Debugging
To debug an app use included IntelliJ Run Configuration 

API: `[API][Docker] Debug`

## Historical Commands
1. Create monorepo workspace with API
```shell
npx create-nx-workspace@16.5.2 longurlrip
nx g @nx/react:setup-tailwind --project=web
```
2. Create infra project
```shell
nx g @nx/node:application --name infra
nx g @nx/react:setup-tailwind --project=web
```
3. Create AWS CDK project for infra project
```shell
npx cdk init app --language=typescript 
```
4. Create web project
```shell
nx g @nx/react:app web
```
5. Add tailwind to react web project
```shell
nx g @nx/react:setup-tailwind --project=web
```
6. Create shared types library for API & web
```shell
nx g @nrwl/node:library --name types
```

## TODO
- [x] API
- [x] API Docker
- [x] API Lambda
- [ ] Web
- [ ] Web S3 & CDN
- [ ] API Cognito
- [ ] API Auth

## Diagrams
### Architectural Diagram

![Architectural](docs/images/ArchitecturalDiagram.png)
