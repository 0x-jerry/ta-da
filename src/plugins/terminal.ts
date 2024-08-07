import { type TickTickRenderer, type TypeItem, TypeItemType } from '../core'

export function createTerminalRenderer() {
  const core: TickTickRenderer = {
    split(str: string) {
      const isTerminalStyleChar = /^(\x1b\[\d+m)+/g

      const items: TypeItem[] = []

      const ctx = {
        cursor: 0,
        get current() {
          return str[ctx.cursor]
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
            type: TypeItemType.Invisible,
            content: char,
          })
        } else {
          if (/\s/.test(ctx.current)) {
            items.push({
              type: TypeItemType.Space,
              content: ctx.current,
            })
          } else {
            items.push({
              type: TypeItemType.Text,
              content: ctx.current,
            })
          }

          ctx.cursor++
        }
      }

      return items
    },
    render(item: TypeItem) {
      process.stdout.write(item.content)
    },
  }

  return core
}
