# Ta-Da

> [!WARNING]
> Under early development!

Typing animation effect.

## Example

```ts
import { Tada, createTerminalRenderer, createHtmlRenderer } from 'ta-da'

const ti = new Tada({
  renderer: createTerminalRenderer(),
  // or use createHtmlRenderer(),
})

ti.reset('Hello \x1b[1mhelllllllllllo\x1b[22m This is very cool!\nHello world!\n')
await ti.play()
console.log()

ti.reset('**Cool**')
ti.complete()
console.log()

ti.reset('**Cool**')
await ti.play()
console.log()
```
