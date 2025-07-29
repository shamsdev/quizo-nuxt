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
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog-box {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 400px;
  max-width: 85%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

/* Transition Animations */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-zoom-enter-active,
.dialog-zoom-leave-active {
  transition: transform 0.3s ease;
}

.dialog-zoom-enter-from,
.dialog-zoom-leave-to {
  transform: scale(0.9);
}
</style>
