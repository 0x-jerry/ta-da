import { nextChar, splitText } from './_utils'

describe('#nextChar', () => {
  it('should get next char', () => {
    expect(nextChar('123')).toBe('1')
  })

  it('should support emoji', () => {
    expect(nextChar('🍺1')).toBe('🍺')
  })
})

describe('#splitText', () => {
  it('should get next char', () => {
    expect(splitText('123')).eqls(['1', '2', '3'])
  })

  it('should support emoji', () => {
    expect(splitText('🍺1')).eqls(['🍺', '1'])
  })
})
