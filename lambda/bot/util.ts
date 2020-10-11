import axios from 'axios'
import * as Types from '@line/bot-sdk/lib/types'

const url = 'https://script.google.com/macros/s/AKfycbzqm1S9kXJrYtC70aPjfOHT89EFI3BwAY14xIwS79fIwqJHpbQ/exec'

export type AnimeInfo = {
  title: string
  url: string
  summary: string
}

export type GetAnimeInfoBody = {
  animeInfo: AnimeInfo[]
}

export const getAnimeInfo = async (): Promise<GetAnimeInfoBody> => {
  const { data } = await axios.get(url)
  return data
}

export const flexMessage = (animeInfo: AnimeInfo[]): Types.FlexCarousel => ({
  type: 'carousel',
  contents: animeInfo.map(
    (anime) => ({
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: `${anime.title}`,
              uri: `${anime.url}`,
            },
          },
          {
            type: 'text',
            text: `${anime.summary}`,
          },
        ],
      },
    }),
  ),
})
