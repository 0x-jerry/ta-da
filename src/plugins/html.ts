import { type TypeItem, TadaItemType, type TadaRenderer } from '../core'

export function createHtmlRenderer() {
  const opt = {
    el: null as null | HTMLElement,
    cache: '',
  }

  const core: TadaRenderer = {
    split(str) {
      const items: TypeItem[] = []

      const d = document.createElement('div')
      d.innerHTML = str

      d.childNodes.forEach((item) => splitHtml(item, items))

      return items
    },
    render(item) {
      if (!opt.el) return

      opt.cache += item.content

      opt.el.innerHTML = opt.cache
    },
    clear() {
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

function splitHtml(node: Node, items: TypeItem[]) {
  if (node.nodeType === document.TEXT_NODE) {
    const nodes = (node.textContent || '').split('').map((n) => {
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
