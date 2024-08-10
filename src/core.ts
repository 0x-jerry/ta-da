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
      typeSpeed: opt.typeSpeed ?? ((item) => getDelay(item, this.renderer)),
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

      const delay =
        typeof this.option.typeSpeed === 'number'
          ? this.option.typeSpeed
          : this.option.typeSpeed(item)
      this.#timer = sleep(delay)

      try {
        await this.#timer
      } catch (_error) {
        break
      }
    }
  }
}

function getDelay(item: TadaItem, renderer: TadaRenderer) {
  const delay = item.delay ?? renderer.getDelay?.(item)

  if (!isNullish(delay)) {
    return delay
  }

  switch (item.type) {
    case TadaItemType.Invisible:
      return 0
    case TadaItemType.Text:
      return randomRange(10, 30)
    case TadaItemType.Space:
      return 10

    default:
      return randomRange(10, 50)
  }
}
