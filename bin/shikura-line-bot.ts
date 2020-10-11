#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { ShikuraLineBotStack } from '../lib/shikura-line-bot-stack'
import { Environments } from '../lib/environment'
import { bundleLayer } from '../lib/layerSetup'

bundleLayer()

const app = new cdk.App()
const target: Environments = app.node.tryGetContext('target')
if (!target) {
  throw new Error('Invalid target environment')
}

new ShikuraLineBotStack(app, `ShikuraLineBotStack-${target}`, target)
