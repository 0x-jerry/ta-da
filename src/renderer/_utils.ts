/**
 * Split text, support emoji
 *
 * ```ts
 * splitText('🍺123‘) => ['🍺', '1', '2', '3']
 * splitText('‘) => []
 * ```
 *
 * @param str
 * @returns
 */
export function splitText(str: string): string[] {
  const segments = new Intl.Segmenter().segment(str)
  return [...segments].map((n) => n.segment)
}

/**
 * Get next character, support emoji
 *
 * ```ts
 * nextChar('🍺123‘) => '🍺'
 * nextChar('‘) => undefined
 * ```
 */
export function nextChar(str: string) {
  const segments = new Intl.Segmenter().segment(str)
  const iter = segments[Symbol.iterator]()
  const data: Intl.SegmentData | undefined = iter.next().value

  return data?.segment
}
