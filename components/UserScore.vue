<template>
  <div class="user-score" :class="{'current-user': userId === currentUserId}">
    <div class="rank">#{{ rank }}</div>
    <picture>
      <source :srcset="avatarUrls.webp" type="image/webp" width="40" height="40" />
      <img
        :src="avatarUrls.png"
        alt="avatar"
        class="avatar"
        width="40"
        height="40"
        loading="lazy"
        decoding="async"
      />
    </picture>
    <div class="name">{{ username ?? "Guest" }}</div>
    <div class="score">{{ score }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { userStore } from '~/stores/user.store'
import { useAvatarUrl } from '~/composables/useAvatarUrl'

const props = defineProps({
  rank: Number,
  userId: Number,
  avatarId: Number,
  username: String,
  score: Number,
})

const avatarUrls = computed(() => useAvatarUrl(props.avatarId))

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
  background: #ededed;
  border-radius: 10px;
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
