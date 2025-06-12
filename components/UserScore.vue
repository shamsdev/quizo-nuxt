<template>
  <div class="user-score">
    <div class="rank">#{{ rank }}</div>
    <img :src="`/images/avatars/${avatarId}.png`" alt="avatar" class="avatar"/>
    <div class="name">{{ username }}</div>
    <div class="score">{{ score }}</div>
  </div>
</template>

<script setup>
defineProps({
  rank: Number,
  avatarId: Number,
  username: String,
  score: Number,
})
</script>

<style scoped>
.user-score {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.rank {
  width: 32px;
  text-align: center;
  font-weight: bold;
  color: #555;
}

.avatar {
  width: 40px;
  height: 40px;
  margin: 0 10px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.name {
  flex: 1;
  font-weight: 600;
  font-size: 15px;
  color: #333;
}

.score {
  font-weight: bold;
  color: #2c3e50;
}
</style>
