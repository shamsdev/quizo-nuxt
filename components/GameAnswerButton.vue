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
          :size="32"
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
  background: #185581;
  padding: 18px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  position: relative;
  box-shadow: #0e314a 0px 6px 0px;
}

.answer-box.disabled {
  pointer-events: none;
  background: #333 !important;
  cursor: not-allowed;
}

.answer-box.selected {
  background: #c69328 !important;
}

.answer-box.red {
  background: #c63a28 !important;
}


.answer-box.green {
  background: #38c628 !important;
}


.avatars-holder {
  position: absolute;
  top: -26px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  gap: 30px;
}

.avatar {
  padding: 0;
  width: 32px;
  height: 32px;
  scale: 0.4;
}
</style>
