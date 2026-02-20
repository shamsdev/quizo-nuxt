<template>
  <div
      class="answer-box"
      :class="{
        disabled: props.disabled,
        selected: props.selected,
        red: props.red,
        green: props.green,
        'answer-box--press': isPressed,
      }"
      @mousedown="isPressed = true"
      @mouseup="isPressed = false"
      @mouseleave="isPressed = false"
      @touchstart.passive="isPressed = true"
      @touchend.passive="isPressed = false"
  >
    <div class="answer-text">{{ title }}</div>
    <div class="avatars-holder">
      <UserAvatar
          v-for="(avatar, i) in answeredUsers"
          class="avatar"
          :key="avatar.avatarId"
          :show-name="false"
          :avatar-id="avatar.avatarId"
          :user-id="avatar.userId"
          :size="40"
          loading-strategy="lazy"
          :style="{ animationDelay: (i * 0.08) + 's' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  answerIndex: {
    type: Number,
    default: 0,
  },
  answeredUsers: {
    type: Array as PropType<{ avatarId: number, userId: number }[]>,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  red: {
    type: Boolean,
    default: false,
  },
  green: {
    type: Boolean,
    default: false,
  },
})

const isPressed = ref(false);
</script>


<style scoped>
.answer-box {
  background: var(--bg-card);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: background var(--duration-normal) ease,
    transform var(--duration-fast) var(--ease-out-back),
    box-shadow var(--duration-normal) ease,
    border-color var(--duration-normal) ease;
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  position: relative;
  border: 2px solid var(--border-default);
  box-shadow: 0 4px 0 var(--bg-outer);
}

.answer-box:not(.disabled):hover {
  background: var(--bg-elevated);
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 6px 0 var(--bg-outer);
}

.answer-box:not(.disabled).answer-box--press {
  transform: translateY(2px) scale(0.98);
  box-shadow: 0 2px 0 var(--bg-outer);
}

.answer-box.disabled {
  pointer-events: none;
  background: var(--bg-elevated) !important;
  opacity: 0.85;
  cursor: not-allowed;
  border-color: var(--border-subtle);
}

.answer-box.selected {
  background: var(--color-warning) !important;
  border-color: var(--color-warning-dark);
  color: var(--text-inverse);
  box-shadow: 0 4px 0 var(--color-warning-dark);
  animation: selected-pulse 0.5s var(--ease-out-back);
}

.answer-box.red {
  background: var(--color-error) !important;
  border-color: var(--color-error-dark);
  color: var(--text-primary);
  box-shadow: 0 4px 0 var(--color-error-dark);
  animation: wrong-shake 0.5s var(--ease-out-strong);
}

.answer-box.green {
  background: var(--color-success) !important;
  border-color: var(--color-success-dark);
  color: var(--text-primary);
  box-shadow: 0 4px 0 var(--color-success-dark), var(--shadow-glow-success);
  animation: correct-bounce 0.5s var(--ease-out-back);
}

@keyframes selected-pulse {
  0% { transform: scale(1); }
  40% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

@keyframes wrong-shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(6px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
}

@keyframes correct-bounce {
  0% { transform: scale(1); }
  35% { transform: scale(1.08); }
  65% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

.avatars-holder {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  flex-direction: row;
  gap: var(--space-1);
  align-items: center;
  justify-content: center;
}

.avatar {
  padding: 0;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  animation: avatar-in 0.35s var(--ease-out-back) backwards;
}

@keyframes avatar-in {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
