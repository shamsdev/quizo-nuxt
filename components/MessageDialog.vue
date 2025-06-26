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
            :color="btn.color || '#3498db'"
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
  padding: 8px;
  min-width: 320px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #222;
}

.message {
  font-size: 16px;
  text-align: center;
  color: #444;
  line-height: 1.5;
  word-break: break-word;
}

.buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
