<template>
  <BaseDialog ref="dialogRef" :close-on-background="false">
    <div class="message-dialog">
      <div class="title">{{ currentTitle }}</div>
      <div class="message">{{ currentMessage }}</div>
      <div class="buttons">
        <FancyButton
            v-for="(btn, index) in currentButtons"
            :key="index"
            :title="btn.text"
            :color="btn.color || 'primary'"
            :onClick="() => handleButtonClick(btn)"
        />
      </div>
    </div>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/BaseDialog.vue';
import FancyButton from '@/components/FancyButton.vue';

const dialogRef = ref();

const currentTitle = ref('');
const currentMessage = ref('');
const currentButtons = ref([]);

/**
 * Show function that accepts title, message, and buttons.
 * Each button: { text, color, onClick }
 */
const show = (title, message, buttons = []) => {
  currentTitle.value = title
  currentMessage.value = message
  currentButtons.value = buttons
  dialogRef.value?.show();
}

const hide = () => {
  dialogRef.value?.hide();
}

const handleButtonClick = (btn) => {
  if (btn.onClick)
    btn.onClick();

  hide();
}

defineExpose({show, hide})
</script>

<style scoped>
.message-dialog {
  direction: rtl;
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  text-align: center;
  color: var(--text-primary);
}

.message {
  font-size: var(--text-base);
  text-align: center;
  color: var(--text-secondary);
  line-height: 1.6;
  word-break: break-word;
}

.buttons {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}
</style>
