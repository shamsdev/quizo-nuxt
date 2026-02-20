<template>
  <div
      class="answer-box"
      :class="{ disabled: props.disabled, selected: props.selected, red: props.red, green: props.green }"
  >
    <div>{{ title }}</div>
    <div class="avatars-holder">
      <UserAvatar
          v-for="avatar in answeredUsers"
          class="avatar"
          :key="avatar.avatarId"
          :show-name="false"
          :avatar-id="avatar.avatarId"
          :user-id="avatar.userId"
          :size="48"
          loading-strategy="lazy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
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
</script>


<style scoped>
.answer-box {
  background: var(--bg-card);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
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
  transform: translateY(-1px);
  box-shadow: 0 6px 0 var(--bg-outer);
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
}

.answer-box.red {
  background: var(--color-error) !important;
  border-color: var(--color-error-dark);
  color: var(--text-primary);
  box-shadow: 0 4px 0 var(--color-error-dark);
}

.answer-box.green {
  background: var(--color-success) !important;
  border-color: var(--color-success-dark);
  color: var(--text-primary);
  box-shadow: 0 4px 0 var(--color-success-dark);
}

.avatars-holder {
  position: absolute;
  top: -32px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  gap: var(--space-2);
  align-items: center;
}

.avatar {
  padding: 0;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}
</style>
