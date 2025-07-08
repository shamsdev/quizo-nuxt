<script setup lang="ts">

import type {PropType} from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  answeredUsers: {
    type: Array as PropType<{ avatarId: number; }[]>,
    required: false,
  }
});

</script>

<template>
  <div class="answer-box">
    <div>{{ title }}</div>
    <div class="avatars-holder">
      <UserAvatar
          v-for="avatar in answeredUsers"
          class="avatar"
          :show-name="false"
          :avatar-id="avatar.avatarId"
      />
    </div>

  </div>
</template>

<style scoped>
.answer-box {
  background: #444;
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
}

.answer-box:hover {
  background: #666;
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