<template>
  <div class="user-score" :class="{'current-user': userId === currentUserId}">
    <div class="rank">#{{ rank }}</div>
    <UserAvatar
      :avatar-id="avatarId"
      :user-id="userId"
      :username="username"
      :show-name="false"
      :size="40"
      loading-strategy="lazy"
      class="user-score-avatar"
    />
    <div class="name">{{ username ?? "Guest" }}</div>
    <div class="score">{{ score }}</div>
  </div>
</template>

<script setup>
import { userStore } from '~/stores/user.store';

const props = defineProps({
  rank: Number,
  userId: Number,
  avatarId: Number,
  username: String,
  score: Number,
});

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
  padding: var(--space-3) var(--space-4);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  gap: var(--space-2);
}

.user-score.current-user {
  background: rgba(6, 182, 212, 0.2) !important;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.rank {
  width: 32px;
  text-align: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.user-score-avatar {
  flex-shrink: 0;
}

.name {
  flex: 1;
  font-weight: var(--font-weight-semibold);
  font-size: var(--text-base);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: var(--space-4);
}

.score {
  font-weight: var(--font-weight-bold);
  font-size: var(--text-base);
  color: var(--color-primary);
}
</style>
