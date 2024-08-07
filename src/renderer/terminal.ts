import { ensureArray } from '@0x-jerry/utils'
import { type TadaRenderer, type TadaItem, TadaItemType } from '../types'
import { firstChar } from './_utils'

export function createTerminalRenderer() {
  const core: TadaRenderer = {
    split(str: string) {
      const isTerminalStyleChar = /^(\x1b\[\d+m)+/g

      const items: TadaItem[] = []

      const ctx = {
        cursor: 0,
        get current() {
          return firstChar(this.subStr()) || ''
        },
        subStr() {
          return str.slice(ctx.cursor)
        },
      }

      while (ctx.cursor < str.length) {
        const subStr = ctx.subStr()
        const [hit] = subStr.match(isTerminalStyleChar) || []

        if (hit) {
          const char = subStr.slice(0, hit.length)
          ctx.cursor += hit.length

          items.push({
            type: TadaItemType.Invisible,
            content: char,
          })
        } else {
          const currentChar = ctx.current

          if (/\s/.test(currentChar)) {
            items.push({
              type: TadaItemType.Space,
              content: currentChar,
            })
          } else {
            items.push({
              type: TadaItemType.Text,
              content: currentChar,
            })
          }

          ctx.cursor += currentChar.length
        }
      }

      return items
    },
    render(items) {
      for (const item of ensureArray(items)) {
        process.stdout.write(item.content)
      }
    },
  }

  return core
}
