<script setup lang="ts">
import { Tada, createHtmlRenderer } from 'ta-da'
import { computed, onMounted, reactive, ref } from 'vue'
import { marked } from 'marked'

const el = ref<HTMLElement>()

const tt = new Tada({
  renderer: createHtmlRenderer(),
})

const data = reactive({
  text: 'Hello, **This is a `test`**, `very cool`! ~~and~~ #beautiful! ',
})

const markdownString = computed(() => marked(data.text, { async: false }) as string)

onMounted(() => {
  tt.renderer.setup(el.value!)

  type()
})

async function type() {
  const s = await marked(data.text)
  tt.type(s)
}
</script>

<template>
  <div>
    <div class="desc">
      <strong> Type Test </strong>
      <button @click="tt.play()">Play</button>
      <button @click="tt.pause()">Pause</button>
      <button @click="type">Reset</button>
    </div>

    <div class="editor">
      <textarea cols="60" rows="5" v-model="data.text"></textarea>
      <div v-html="markdownString">
      </div>
    </div>

    <div class="markdown-body" ref="el"></div>
  </div>
</template>

<style scoped>
.desc {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.editor {
  display: flex;
}

.editor>div {
  flex: 1;
}
</style>
