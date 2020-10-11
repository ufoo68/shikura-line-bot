import * as Lambda from 'aws-lambda'
import * as Line from '@line/bot-sdk'
import * as Types from '@line/bot-sdk/lib/types'
import { buildReplyText } from 'line-message-builder'
import { getAnimeInfo, flexMessage } from './util'

const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN!
const channelSecret = process.env.CHANNEL_SECRET!

const config: Line.ClientConfig = {
  channelAccessToken,
  channelSecret,
}
const client = new Line.Client(config)

async function eventHandler(event: Types.MessageEvent): Promise<any> {
  if (event.type !== 'message' || event.message.type !== 'text' || !event.source.userId) {
    return null
  }
  if (event.message.text === '今季のオススメ') {
    const res = await getAnimeInfo()
    return client.replyMessage(event.replyToken, [
      buildReplyText('私がオススメする今季のアニメはこちらです。'),
      {
        type: 'flex',
        altText: '今季のオススメアニメ',
        contents: flexMessage(res.animeInfo),
      }])
  }
  return client.replyMessage(event.replyToken, buildReplyText('ごめんなさい、未対応のメッセージです。'))
}

export const handler: Lambda.APIGatewayProxyHandler = async (proxyEevent: Lambda.APIGatewayEvent) => {
  const signature = proxyEevent.headers['X-Line-Signature']
  if (!Line.validateSignature(proxyEevent.body!, channelSecret, signature)) {
    throw new Line.SignatureValidationFailed('signature validation failed', signature)
  }

  const body: Line.WebhookRequestBody = JSON.parse(proxyEevent.body!)
  await Promise
    .all(body.events.map(async (event) => eventHandler(event as Types.MessageEvent)))
    .catch((err) => {
      console.error(err.Message)
      return {
        statusCode: 500,
        body: 'Error',
      }
    })
  return {
    statusCode: 200,
    body: 'OK',
  }
}
