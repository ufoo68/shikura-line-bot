import * as cdk from '@aws-cdk/core'
import * as ssm from '@aws-cdk/aws-ssm'
import * as lambda from '@aws-cdk/aws-lambda'
import { LambdaApi } from 'cdk-lambda-api'
import { Environments } from './environment'

export class ShikuraLineBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, target: Environments, props?: cdk.StackProps) {
    super(scope, id, props)

    const channelAccessToken = ssm.StringParameter.fromStringParameterAttributes(this, `channel-access-token-${target}`, {
      parameterName: `shikura-channel-access-token-${target}`,
    }).stringValue

    const channelSecret = ssm.StringParameter.fromStringParameterAttributes(this, `channel-secret-${target}`, {
      parameterName: `shikura-channel-secret-${target}`,
    }).stringValue

    const layer = new lambda.LayerVersion(this, `layer-${target}`, {
      compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
      code: lambda.Code.fromAsset('layer.out'),
    })

    new LambdaApi(this, `shikura-bot-${target}`, {
      lambdaPath: './lambda/bot',
      environment: {
        CHANNEL_ACCESS_TOKEN: channelAccessToken,
        CHANNEL_SECRET: channelSecret,
      },
      layer,
    })
  }
}
