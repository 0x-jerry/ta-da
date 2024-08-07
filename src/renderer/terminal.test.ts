import { createTerminalRenderer } from './terminal'

describe('terminal renderer', () => {
  it('should split string correctly', () => {
    const r = createTerminalRenderer()
    const items = r.split('hell o \x1b[1m123\x1b[22m 🚀 emoji')

    expect(items).matchSnapshot()
  })
})
