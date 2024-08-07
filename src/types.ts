import type { Awaitable, Optional } from '@0x-jerry/utils'
import type { Tada } from './core'

export interface TadaRenderer<U extends TadaItem = TadaItem> {
  split(str: string): Awaitable<U[]>
  render(item: U, ctx: Tada): Awaitable<void>
  getDelay?(item: U): Optional<number>
  clear?(): void
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
