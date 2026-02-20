<template>
  <button
    class="fancy-button"
    :class="colorClass"
    :style="customStyle"
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
    default: 'primary',
  },
  onClick: {
    type: Function,
    default: () => {},
  },
})

const isActive = ref(false)

const colorClass = computed(() => {
  const tokens = ['primary', 'secondary', 'success', 'error', 'play', 'leaderboard']
  if (tokens.includes(props.color))
    return `fancy-button--${props.color}`
  return ''
})

const customStyle = computed(() => {
  if (props.color.startsWith('#'))
    return {
      '--btn-bg': props.color,
      '--btn-shadow': darkenHex(props.color, 0.25),
    }
  return {}
})

function darkenHex(hex, amount = 0.25) {
  if (!hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) return 'rgba(0,0,0,0.25)'
  if (hex.length === 4) hex = '#' + hex.slice(1).split('').map(x => x + x).join('')
  const num = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) - 255 * amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) - 255 * amount))
  const b = Math.max(0, Math.min(255, (num & 0xff) - 255 * amount))
  return `rgb(${r}, ${g}, ${b})`
}
</script>

<style scoped>
.fancy-button {
  --btn-bg: var(--color-primary);
  --btn-shadow: var(--color-primary-dark);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0 var(--space-5);
  min-width: 100px;
  min-height: 48px;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  background: var(--btn-bg);
  box-shadow: 0 4px 0 var(--btn-shadow);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  text-align: center;
  user-select: none;
}

.fancy-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--btn-shadow);
}

.fancy-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.fancy-button--primary {
  --btn-bg: var(--color-primary);
  --btn-shadow: var(--color-primary-dark);
}

.fancy-button--secondary {
  --btn-bg: var(--color-secondary);
  --btn-shadow: var(--color-secondary-dark);
}

.fancy-button--success {
  --btn-bg: var(--color-success);
  --btn-shadow: var(--color-success-dark);
}

.fancy-button--error {
  --btn-bg: var(--color-error);
  --btn-shadow: var(--color-error-dark);
}

.fancy-button--play {
  --btn-bg: var(--color-cta-play);
  --btn-shadow: var(--color-cta-play-dark);
  box-shadow: 0 4px 0 var(--color-cta-play-dark), var(--shadow-glow-gold);
}

.fancy-button--play:active {
  box-shadow: 0 2px 0 var(--color-cta-play-dark), var(--shadow-glow-gold);
}

.fancy-button--leaderboard {
  --btn-bg: var(--color-cta-leaderboard);
  --btn-shadow: var(--color-cta-leaderboard-dark);
  box-shadow: 0 4px 0 var(--color-cta-leaderboard-dark), var(--shadow-glow-gold);
}

.fancy-button--leaderboard:active {
  box-shadow: 0 2px 0 var(--color-cta-leaderboard-dark), var(--shadow-glow-gold);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.title {
  line-height: 1;
}
</style>
