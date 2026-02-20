<template>
  <Teleport to="body">
    <transition name="dialog-fade">
      <div
          v-if="visible"
          class="dialog-overlay"
          @click.self="onBackgroundClick"
      >
        <transition name="dialog-zoom">
          <div class="dialog-wrapper" v-if="visible">
            <div class="dialog-box">
              <slot/>
            </div>
            <button
                v-if="showCloseButton"
                type="button"
                class="dialog-close"
                aria-label="بستن"
                @click="hide"
            >
              <X size="20" />
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  closeOnBackground: {
    type: Boolean,
    default: true
  },
  /** When true, shows a red round close button at top-right, semi-outside the dialog (does not affect content layout) */
  showCloseButton: {
    type: Boolean,
    default: false
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

.dialog-wrapper {
  position: relative;
  display: inline-block;
  max-width: 90%;
}

.dialog-box {
  background: var(--bg-inner);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  width: var(--dialog-max-width);
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-default);
}

.dialog-close {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-error);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: background var(--duration-fast, 0.2s) ease, transform var(--duration-fast, 0.2s) ease;
}

.dialog-close:hover {
  background: var(--color-error-dark);
}

.dialog-close:active {
  transform: scale(0.95);
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
