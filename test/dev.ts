import { Tada, createTerminalRenderer } from '../src'

const ti = new Tada({
  renderer: createTerminalRenderer(),
})

ti.reset('Hello This is very cool!\nHello world!\n')
await ti.play()
console.log()

ti.reset('**Cool**')
ti.complete()
console.log()

ti.reset('**Cool**')
await ti.play()
console.log()
