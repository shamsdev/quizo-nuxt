<template>
  <div class="leaderboard-dialog">
    <!-- Top Fixed Title Section -->
    <div class="dialog-header">
      <h2>جدول امتیازات</h2>
    </div>

    <!-- Scrollable Score List -->
    <div class="score-list">
      <div v-if="isLoading" class="h-100">
        <v-skeleton-loader type="list-item-avatar"/>
        <v-skeleton-loader type="list-item-avatar"/>
        <v-skeleton-loader type="list-item-avatar"/>
        <v-skeleton-loader type="list-item-avatar"/>
        <v-skeleton-loader type="list-item-avatar"/>
      </div>
      <div v-else-if="userScores.length > 0">
        <UserScore
            class="mb-2"
            v-for="(userScore, index) in userScores"
            :rank="index + 1"
            :user-id="userScore.userId"
            :avatarId="userScore.avatarId"
            :username="userScore.name"
            :score="userScore.score"
        />
      </div>
      <div v-else class="empty-state">
        <p>موردی وجود ندارد</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import UserScore from './UserScore.vue'

const {$karizmaConnection} = useNuxtApp();
const isLoading = ref(true);

const userScores = ref([
  {id: 1, name: 'Alice', score: 980, avatarId: 1},
  {id: 2, name: 'Bob', score: 910, avatarId: 2},
  {id: 3, name: 'Charlie', score: 875, avatarId: 3},
  {id: 4, name: 'Dana', score: 860, avatarId: 4},
  {id: 5, name: 'Eve', score: 830, avatarId: 5},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
]);

onBeforeMount(() => {
  userScores.value = [];
})

onMounted(() => {
  getLeaderboard();
})

async function getLeaderboard() {
  isLoading.value = true;
  userScores.value = [];

  const leaderboardData = await $karizmaConnection.connection
      .request('leaderboard/get-top-scores');

  userScores.value = leaderboardData.Result.map((data) => {
    return {
      userId: data.UserProfile.UserId,
      name: data.UserProfile.DisplayName,
      avatarId: parseInt(data.UserProfile.Avatar),
      score: data.Score,
    }
  });

  isLoading.value = false;
}
</script>

<style scoped>
.leaderboard-dialog {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  padding: var(--space-4);
  box-sizing: border-box;
  overflow: hidden;
}

.dialog-header {
  flex-shrink: 0;
  text-align: center;
  margin-bottom: var(--space-3);
}

.dialog-header h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--text-primary);
}

.score-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 400px;
  min-height: 400px;
  scrollbar-color: var(--color-primary) var(--bg-card);
  scrollbar-width: thin;
}

/* WebKit: theme scrollbar */
.score-list::-webkit-scrollbar {
  width: 8px;
}

.score-list::-webkit-scrollbar-track {
  background: var(--bg-card);
  border-radius: var(--radius-full);
}

.score-list::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: var(--radius-full);
}

.score-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-orange-light);
}

.empty-state {
  text-align: center;
  padding: var(--space-12);
}

.empty-state p {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-base);
}
</style>
