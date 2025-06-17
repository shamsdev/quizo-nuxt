<template>
  <button
      class="fancy-button"
      :style="{
      backgroundColor: color,
      boxShadow: isActive ? `0 3px 0 ${shadowColor}` : `0 6px 0 ${shadowColor}`
    }"
      @click="onClick"
      @mousedown="isActive = true"
      @mouseup="isActive = false"
      @mouseleave="isActive = false"
  >
    <span v-if="icon" class="icon">
      <component :is="icon" />
    </span>
    <span class="title">{{ title }}</span>
  </button>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  color: {
    type: String,
    default: '#34ace0',
  },
  onClick: {
    type: Function,
    default: () => {},
  },
})

const isActive = ref(false)

// Utility: darken a hex color
function darkenColor(hex, amount = 0.2) {
  if (!hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) return 'rgba(0,0,0,0.2)'

  // Expand short hex (#abc → #aabbcc)
  if (hex.length === 4) {
    hex = '#' + hex.slice(1).split('').map(x => x + x).join('')
  }

  const num = parseInt(hex.slice(1), 16)
  let r = (num >> 16) - 255 * amount
  let g = ((num >> 8) & 0x00FF) - 255 * amount
  let b = (num & 0x0000FF) - 255 * amount

  r = Math.max(0, Math.min(255, Math.round(r)))
  g = Math.max(0, Math.min(255, Math.round(g)))
  b = Math.max(0, Math.min(255, Math.round(b)))

  return `rgb(${r}, ${g}, ${b})`
}

const shadowColor = computed(() => darkenColor(props.color, 0.2))
</script>

<style scoped>
.fancy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 12px 20px;
  min-width: 100px;
  min-height: 48px;

  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  transition: transform 0.1s ease, box-shadow 0.1s ease;
  text-align: center;
  text-wrap: none;

  user-select: none;
}

.fancy-button:active {
  transform: translateY(2px);
}

.fancy-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.title {
  line-height: 1;
}
</style>
