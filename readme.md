# Ta-Da

> [!WARNING]
> Under early development!

Typing animation effect.

## Install

```sh
pnpm i @0x-jerry/ta-da
```

## Example

```ts
import { Tada, createTerminalRenderer, createHtmlRenderer } from '@0x-jerry/ta-da'

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
