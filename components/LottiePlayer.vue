<template>
  <div ref="container"/>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue'
import lottie from 'lottie-web'

const container = ref<HTMLElement | null>(null)
let animationInstance: any = null

const props = defineProps<{
  animationData: object,
  loop?: boolean,
  autoplay?: boolean
}>()

onMounted(() => {
  if (container.value) {
    animationInstance = lottie.loadAnimation({
      container: container.value,
      renderer: 'svg',
      loop: props.loop ?? true,
      autoplay: props.autoplay ?? true,
      animationData: props.animationData
    })
  }
})

onBeforeUnmount(() => {
  animationInstance?.destroy()
})
</script>
