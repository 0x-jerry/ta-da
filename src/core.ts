import { type PromiseInstance, createPromise, sleep, isNullish } from '@0x-jerry/utils'
import { randomRange } from './utils'
import { createTerminalRenderer } from './plugins'
import { type TadaRenderer, type TadaItem, type TadaOption, TadaItemType } from './types'

export class Tada<Renderer extends TadaRenderer = TadaRenderer> {
  queue: TadaItem[] = []

  isPlaying = false

  #ins?: PromiseInstance<void>

  /**
   * current playing index
   */
  cursor = 0

  get playing() {
    return this.#ins?.instance
  }

  renderer: Renderer

  option: Required<Omit<TadaOption, 'renderer'>>

  constructor(opt: TadaOption<Renderer> = {}) {
    this.renderer = opt.renderer || (createTerminalRenderer() as Renderer)

    this.option = {
      autoPlay: opt.autoPlay ?? true,
    }
  }

  pause() {
    this.isPlaying = false
  }

  play() {
    if (this.isPlaying) return

    this.#prepareForPlay()
    this.#play()
  }

  async type(str: string) {
    this.clear()

    if (this.option.autoPlay) {
      this.#prepareForPlay()
    }

    const items = await this.renderer.split(str)
    this.queue.push(...items)

    if (this.option.autoPlay) {
      await this.#play()
    }
  }

  clear() {
    this.pause()
    this.cursor = 0
    this.queue = []

    this.renderer.clear?.()
  }

  async #prepareForPlay() {
    if (this.isPlaying) return

    if (!this.#ins?.isPending) {
      this.#ins = createPromise()
    }

    this.isPlaying = true
  }

  async #play() {
    while (this.cursor < this.queue.length) {
      // paused
      if (!this.isPlaying) {
        this.#ins?.resolve()
        break
      }

      const item = this.queue[this.cursor]

      await this.renderer.render(item, this)

      await sleep(this.#getDelay(item))

      this.cursor++
    }

    this.#ins?.resolve()
  }

  #getDelay(item: TadaItem) {
    const delay = item.delay ?? this.renderer.getDelay?.(item)

    if (!isNullish(delay)) {
      return delay
    }

    switch (item.type) {
      case TadaItemType.Invisible:
        return 0
      case TadaItemType.Text:
        return randomRange(30, 50)
      case TadaItemType.Space:
        return randomRange(100, 100)

      default:
        return randomRange(10, 50)
    }
  }
}
