<template>
  <div class="user-avatar">
    <img
        :src="avatarUrl"
        :alt="username"
        class="avatar-img"
    />
    <div class="username">
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
  border: 4px solid #3498db;
  object-fit: cover;
}

.username {
  background-color: #3498db;
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
