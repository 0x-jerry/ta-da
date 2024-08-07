// @vitest-environment happy-dom

import { createHtmlRenderer } from './html'

describe('terminal renderer', () => {
  it('should split html correctly', () => {
    const r = createHtmlRenderer()
    const items = r.split('<div> hello <b> world <em> eee </em>  world </b> 🚀🚀 123 </div>')

    expect(items).matchSnapshot()
  })
})
