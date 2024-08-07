import { Tada, createTerminalRenderer } from '../src'

const ti = new Tada({
  renderer: createTerminalRenderer(),
})

ti.type('Hello This is very cool!\nHello world!\n')
