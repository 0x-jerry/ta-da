<script setup lang="ts">
import { Tada, createHtmlRenderer } from '@0x-jerry/ta-da'
import { onMounted, reactive, ref } from 'vue'
import { marked } from 'marked'

const el = ref<HTMLElement>()


const data = reactive({
  text: 'Hello, **This is a `test`**, and it\'s `very cool`! 🚀🚀 ~~and~~ #beautiful! ',
  speed: 10,
})

const tt = new Tada({
  renderer: createHtmlRenderer(),
  typeSpeed(item) {
    return data.speed
  },
})

onMounted(() => {
  tt.renderer.setup(el.value!)

  type()
})

async function type() {
  const s = await marked(data.text)
  tt.reset(s)
  await tt.play()
}

function complete() {
  tt.complete()
}
</script>

<template>
  <div class="size-screen flex flex-col gap-4 p-4">
    <div class="desc">
      <strong> Type Test </strong>
      <button @click="tt.play()">Play</button>
      <button @click="tt.pause()">Pause</button>
      <button @click="type">Reset</button>
      <button @click="complete">Complete</button>
      <div>
        <label for="">Type Speed: </label>
        <input type="number" step="1" v-model.number="data.speed" />
      </div>
    </div>

    <div class="flex flex-1 gap-4 h-0">
      <textarea class="flex-1" cols="60" rows="5" v-model="data.text"></textarea>
      <div class="markdown-body flex-1" ref="el"></div>
    </div>
  </div>
</template>

<style scoped>
.desc {
  display: flex;
  gap: 10px;
  align-items: center;
}

.markdown-body {
  border: 1px solid #e6e6e6;
  padding: 8px;
  border-radius: 4px;
}

button {
  border-radius: 8px;
  border: 1px solid gray;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>
