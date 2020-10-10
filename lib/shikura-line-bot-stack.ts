import * as cdk from '@aws-cdk/core'
import { LambdaApi } from 'cdk-lambda-api'

export class ShikuraLineBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new LambdaApi(this, 'shikura-bot', {
      lambdaPath: './lambda/bot',
    })
  }
}
