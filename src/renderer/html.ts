import { ensureArray } from '@0x-jerry/utils'
import { type TadaItem, type TadaRenderer, TadaItemType } from '../types'
import { splitText } from './_utils'

export function createHtmlRenderer() {
  const opt = {
    el: null as null | HTMLElement,
    cache: '',
  }

  const core: TadaRenderer = {
    split(str) {
      const items: TadaItem[] = []

      const parsedDom = document.createElement('div')
      parsedDom.innerHTML = str

      parsedDom.childNodes.forEach((item) => splitHtml(item, items))

      return items
    },
    render(items) {
      for (const item of ensureArray(items)) {
        opt.cache += item.content
      }

      if (!opt.el) return
      opt.el.innerHTML = opt.cache
    },
    reset() {
      opt.cache = ''
    },
  }

  const renderer = {
    setup(el: HTMLElement) {
      opt.el = el
    },
  }

  return {
    ...core,
    ...renderer,
  }
}

function splitHtml(node: Node, items: TadaItem[]) {
  if (node.nodeType === document.TEXT_NODE) {
    const nodes = splitText(node.textContent || '').map((n) => {
      return {
        type: /\s/.test(n) ? TadaItemType.Space : TadaItemType.Text,
        content: n,
      }
    })

    items.push(...nodes)
    return
  }

  if (node.nodeType === document.ELEMENT_NODE) {
    items.push({
      type: TadaItemType.Invisible,
      content: `<${node.nodeName}>`,
    })

    node.childNodes.forEach((item) => splitHtml(item, items))

    items.push({
      type: TadaItemType.Invisible,
      content: `</${node.nodeName}>`,
    })

    return
  }
}
