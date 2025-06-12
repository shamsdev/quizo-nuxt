<template>
  <div class="leaderboard-dialog">
    <!-- Top Fixed Title Section -->
    <div class="dialog-header">
      <h2>Leaderboard</h2>
    </div>

    <!-- Scrollable Score List -->
    <div class="score-list">
      <UserScore
          v-for="(user, index) in users"
          :key="user.id"
          :rank="index + 1"
          :avatarId="user.avatarId"
          :username="user.name"
          :score="user.score"
      />
    </div>
  </div>
</template>

<script setup>
import UserScore from './UserScore.vue'

const users = [
  {id: 1, name: 'Alice', score: 980, avatarId: 1},
  {id: 2, name: 'Bob', score: 910, avatarId: 2},
  {id: 3, name: 'Charlie', score: 875, avatarId: 3},
  {id: 4, name: 'Dana', score: 860, avatarId: 4},
  {id: 5, name: 'Eve', score: 830, avatarId: 5},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},
  {id: 6, name: 'Frank', score: 800, avatarId: 6},

  // Add more users as needed
]
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
}
</style>
