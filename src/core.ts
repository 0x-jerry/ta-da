import { sleep, isNullish, type SleepResult } from '@0x-jerry/utils'
import { randomRange } from './utils'
import { createTerminalRenderer } from './renderer'
import { type TadaRenderer, type TadaItem, type TadaOption, TadaItemType } from './types'

export class Tada<Renderer extends TadaRenderer = TadaRenderer> {
  #queue: TadaItem[] = []

  isPlaying = false

  /**
   * current playing index
   */
  cursor = 0

  renderer: Renderer
  option: Required<Omit<TadaOption, 'renderer'>>

  source = ''

  #timer?: SleepResult

  constructor(opt: TadaOption<Renderer> = {}) {
    this.renderer = opt.renderer || (createTerminalRenderer() as Renderer)

    this.option = {
      autoPlay: opt.autoPlay ?? true,
    }
  }

  pause() {
    this.#timer?.cancel()
    this.#timer = undefined
    this.isPlaying = false
  }

  async play() {
    if (this.isPlaying) return
    this.isPlaying = true

    await this.#continuePlay()
    this.#timer = undefined
    this.isPlaying = false
  }

  complete() {
    this.pause()
    const items = this.#queue.slice(this.cursor)
    this.renderer.render(items)
    this.cursor = this.#queue.length
  }

  reset(str: string = '') {
    this.source = str

    this.#reset()
  }

  #reset() {
    this.pause()
    this.cursor = 0
    this.isPlaying = false

    const items = this.renderer.split(this.source)
    this.#queue = items

    this.renderer.reset?.()
  }

  async #continuePlay() {
    while (this.cursor < this.#queue.length) {
      // paused
      if (!this.isPlaying) {
        break
      }

      const item = this.#queue[this.cursor]

      this.renderer.render(item)
      this.cursor++

      this.#timer = sleep(this.#getDelay(item))

      try {
        await this.#timer
      } catch (_error) {
        break
      }
    }
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
