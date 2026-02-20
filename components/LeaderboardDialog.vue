<template>
  <div class="leaderboard-dialog">
    <!-- Top Fixed Title Section -->
    <div class="dialog-header">
      <h2>جدول امتیازات</h2>
    </div>

    <!-- Scrollable Score List -->
    <div ref="scoreListRef" class="score-list scroll-styled">
      <div v-if="isLoading" class="leaderboard-skeleton">
        <v-skeleton-loader type="list-item-avatar" class="skeleton-dark"/>
        <v-skeleton-loader type="list-item-avatar" class="skeleton-dark"/>
        <v-skeleton-loader type="list-item-avatar" class="skeleton-dark"/>
        <v-skeleton-loader type="list-item-avatar" class="skeleton-dark"/>
        <v-skeleton-loader type="list-item-avatar" class="skeleton-dark"/>
      </div>
      <template v-else-if="userScores.length > 0">
        <div
            v-for="(userScore, index) in userScores"
            :key="userScore.userId"
            class="score-row"
            :data-user-id="userScore.userId"
        >
          <UserScore
              class="mb-2"
              :rank="index + 1"
              :user-id="userScore.userId"
              :avatarId="userScore.avatarId"
              :username="userScore.name"
              :score="userScore.score"
          />
        </div>
      </template>
      <div v-else class="empty-state">
        <p>موردی وجود ندارد</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserScore from './UserScore.vue'
import { userStore } from '~/stores/user.store'

const emit = defineEmits(['close'])
const {$karizmaConnection} = useNuxtApp()
const userId = userStore().userId
const isLoading = ref(true)
const scoreListRef = ref(null)
const userScores = ref([])

onBeforeMount(() => {
  userScores.value = []
})

onMounted(() => {
  getLeaderboard()
})

async function getLeaderboard() {
  isLoading.value = true
  userScores.value = []

  const leaderboardData = await $karizmaConnection.connection
      .request('leaderboard/get-top-scores')

  userScores.value = leaderboardData.Result.map((data) => ({
    userId: data.UserProfile.UserId,
    name: data.UserProfile.DisplayName,
    avatarId: parseInt(data.UserProfile.Avatar),
    score: data.Score,
  }))

  isLoading.value = false
  scrollToCurrentUser()
}

function scrollToCurrentUser() {
  nextTick(() => {
    if (!scoreListRef.value || !userId) return
    const row = scoreListRef.value.querySelector(`[data-user-id="${userId}"]`)
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
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

.score-row {
  flex-shrink: 0;
}

.score-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 400px;
  min-height: 400px;
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

/* Dark-theme skeleton to match app (RTL like real score rows) */
.leaderboard-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  direction: rtl;
}

.leaderboard-skeleton :deep(.v-skeleton-loader) {
  background: var(--bg-elevated) !important;
}

.leaderboard-skeleton :deep(.v-skeleton-loader__avatar),
.leaderboard-skeleton :deep(.v-skeleton-loader__bone),
.leaderboard-skeleton :deep(.v-skeleton-loader__text) {
  background: var(--bg-card) !important;
}

.leaderboard-skeleton :deep(.v-skeleton-loader__avatar::after),
.leaderboard-skeleton :deep(.v-skeleton-loader__bone::after) {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent) !important;
}
</style>
