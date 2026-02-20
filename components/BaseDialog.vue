<template>
  <Teleport to="body">
    <transition name="dialog-fade">
      <div
          v-if="visible"
          class="dialog-overlay"
          @click.self="onBackgroundClick"
      >
        <transition name="dialog-zoom">
          <div class="dialog-box" v-if="visible">
            <slot/>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  closeOnBackground: {
    type: Boolean,
    default: true
  }
})

const visible = ref(false)

const show = () => {
  visible.value = true
  document.body.style.overflow = 'hidden'
}
const hide = () => {
  visible.value = false
  document.body.style.overflow = ''
}

const onBackgroundClick = () => {
  if (props.closeOnBackground) {
    hide()
  }
}


onMounted(() => {
  useDialogManager.onCloseAll(hide);
});

onBeforeUnmount(() => {
  useDialogManager.offCloseAll(hide);
});

defineExpose({ show, hide })
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-4);
}

.dialog-box {
  background: var(--bg-inner);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  width: var(--dialog-max-width);
  max-width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-default);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.25s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-zoom-enter-active,
.dialog-zoom-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-zoom-enter-from,
.dialog-zoom-leave-to {
  transform: scale(0.92);
}
</style>
