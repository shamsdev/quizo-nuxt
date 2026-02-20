<template>
  <Teleport to="body">
    <transition name="dialog">
      <div
          v-if="visible"
          class="dialog-overlay"
          @click.self="onBackgroundClick"
      >
        <div class="dialog-wrapper">
          <div class="dialog-box scroll-styled">
            <slot/>
          </div>
          <div v-if="showCloseButton" class="dialog-close-wrapper">
            <FancyButton
                title="بستن"
                :icon="X"
                icon-only
                :icon-size="20"
                color="error"
                :on-click="hide"
            />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import FancyButton from '~/components/FancyButton.vue'

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

const visible = ref(false);

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
  box-sizing: border-box;
}

.dialog-wrapper {
  position: relative;
  display: inline-block;
  width: fit-content;
  max-width: min(90%, calc(100vw - 2 * var(--space-4)));
  box-sizing: border-box;
}

.dialog-box {
  background: var(--bg-inner);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  width: var(--dialog-max-width);
  max-width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-default);
  box-sizing: border-box;
}

.dialog-close-wrapper {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}
</style>

