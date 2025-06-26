<template>
  <div class="message-dialog">
    <!-- Title -->
    <div class="title">
      {{ title }}
    </div>

    <!-- Message -->
    <div class="message">
      {{ message }}
    </div>

    <!-- Buttons -->
    <div class="buttons">
      <FancyButton
          v-for="(btn, index) in buttons"
          :key="index"
          :title="btn.text"
          :color="btn.color || '#3498db'"
          :onClick="btn.onClick"
      />
    </div>
  </div>
</template>

<script setup>
import FancyButton from '@/components/FancyButton.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  buttons: {
    type: Array,
    required: true
    // Each button: { text: String, color: String, onClick: Function }
  }
})
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
