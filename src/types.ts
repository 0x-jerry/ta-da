import type { Arrayable, Awaitable, Optional } from '@0x-jerry/utils'

export interface TadaRenderer<U extends TadaItem = TadaItem> {
  split(str: string): Awaitable<U[]>
  render(item: Arrayable<U>): Awaitable<void>
  getDelay?(item: U): Optional<number>
  reset?(): void
}

export enum TadaItemType {
  Space = 'space',
  Invisible = 'invisible',
  Text = 'text',
}

export interface TadaItem {
  type: TadaItemType
  content: string
  delay?: number
}

export interface TadaOption<T extends TadaRenderer = TadaRenderer> {
  renderer?: T
  /**
   * @default true
   */
  autoPlay?: boolean
}
