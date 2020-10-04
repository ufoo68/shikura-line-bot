#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ShikuraLineBotStack } from '../lib/shikura-line-bot-stack';

const app = new cdk.App();
new ShikuraLineBotStack(app, 'ShikuraLineBotStack');
