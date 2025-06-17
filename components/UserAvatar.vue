<template>
  <div class="user-avatar">
    <img
        :src="avatarUrl"
        :alt="username"
        class="avatar-img"
        :style="{
          borderColor: color
        }"
    />
    <div class="username" :style="{
      backgroundColor: color
    }">
      <p>{{ username }}</p>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  avatarId: {
    type: [String, Number],
    required: true,
  },
  color: {
    type: String,
    default: '#34ace0',
  },
})

const avatarUrl = computed(() =>
    `/images/avatars/${props.avatarId}.png` // Replace with your actual image URL pattern
)
</script>

<style scoped>
.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-img {
  width: 105px;
  height: 105px;
  border-radius: 50%;
  border: 4px solid;
  object-fit: cover;
}

.username {
  border-radius: 20px;
  padding: 2px 8px;
  margin-top: -8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.username p {
  color: white;
  font-size: 15px;
  font-weight: 600;
}
</style>
