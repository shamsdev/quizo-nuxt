<template>
  <div class="user-score" :class="{'current-user': userId === currentUserId}">
    <div class="rank">#{{ rank }}</div>
    <img :src="`/images/avatars/${avatarId}.png`" alt="avatar" class="avatar"/>
    <div class="name">{{ username ?? "Guest" }}</div>
    <div class="score">{{ score }}</div>
  </div>
</template>

<script setup>
import {userStore} from "~/stores/user.store.js";

defineProps({
  rank: Number,
  userId: Number,
  avatarId: Number,
  username: String,
  score: Number,
})

const currentUserId = ref(null);

onMounted(() => {
  currentUserId.value = userStore().userId;
});

</script>

<style scoped>
.user-score {
  direction: rtl;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.user-score.current-user {
  background: #9ce469 !important;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 20px;
}

.score {
  font-weight: bold;
  color: #2c3e50;
}
</style>
