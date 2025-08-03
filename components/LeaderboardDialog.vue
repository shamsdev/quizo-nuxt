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
      <div v-else>
        <p class="text-center mt-12">موردی وجود ندارد</p>
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
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
}

.dialog-header {
  flex-shrink: 0;
  text-align: center;
  margin-bottom: 12px;
}

.dialog-header h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.score-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  min-height: 400px;
}
</style>
