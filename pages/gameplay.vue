<template>
  <div class="gameplay-container">
    <!-- Top Bar: Players Info -->
    <div class="top-bar">
      <div class="player-info left">
        <UserAvatar username="Mohammad"
                    avatarId="3"
                    class="user-avatar"
        />
        <div class="score-box">{{ my.score }}</div>
      </div>

      <div class="player-info right">
        <div class="score-box">{{ opponent.score }}</div>
        <UserAvatar username="Sara"
                    avatarId="1"
                    class="user-avatar"
        />
      </div>
    </div>

    <!-- Questions Count Box -->
    <div class="question-count-box-bg mt-4">
      <div class="question-count-box">
        <h2>Question 2/6</h2>
      </div>
    </div>

    <!-- Question Box -->
    <div class="question-box mt-2">
      <h2>{{ currentQuestion.question }}</h2>
    </div>

    <!-- Timer Progress Bar -->
    <div class="timer-bar-wrapper mt-4">
      <div class="timer-bar" :style="{ width: timerProgress + '%' }"></div>
    </div>

    <!-- Answers Grid -->
    <div class="answers-grid mt-4">
      <div
          v-for="(answer, index) in currentQuestion.answers"
          :key="index"
          class="answer-box"
          @click="selectAnswer(index)"
      >
        {{ answer }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const my = ref({
  name: 'You',
  avatar: '/images/avatars/1.png',
  score: 0,
})

const opponent = ref({
  name: 'Opponent',
  avatar: '/images/avatars/2.png',
  score: 0,
})

const currentQuestion = ref({
  question: 'What is the capital of France?',
  answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
})

const timerProgress = ref(100)

let timerInterval

const startTimer = () => {
  timerProgress.value = 100
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timerProgress.value > 0) {
      timerProgress.value -= 1
    } else {
      clearInterval(timerInterval)
      // Handle timeout
    }
  }, 100) // 10s timer
}

const selectAnswer = (index) => {
  console.log('Answer selected:', currentQuestion.value.answers[index])
  // TODO: Emit to server, validate, update score
}

onMounted(() => {
  startTimer()
})
</script>

<style scoped>
.user-avatar {
  scale: 0.9;
  width: 94px;
  height: auto;
}

.gameplay-container {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  color: #fff;
  font-family: sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-info.left {
  justify-content: flex-start;
}

.player-info.right {
  justify-content: flex-end;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.name {
  font-weight: bold;
}

.score-box {
  background: #333;
  border-radius: 16px;
  padding: 6px 12px;
  font-weight: bold;
}

.question-count-box-bg {
  width: 100%;
  display: flex;
  justify-content: center;
}

.question-count-box {
  text-align: center;
  font-size: 10px;
  background: #2c2c2c;
  padding: 12px;
  border-radius: 16px;
  width: fit-content;
}

.question-box {
  text-align: center;
  font-size: 16px;
  background: #2c2c2c;
  padding: 20px;
  border-radius: 16px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-bar-wrapper {
  width: 100%;
  height: 16px;
  background: rgba(61, 54, 54, 0.84);
  border-radius: 16px;
  overflow: hidden;
}

.timer-bar {
  height: 100%;
  background: #4caf50;
  transition: width 0.1s linear;
}

.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.answer-box {
  background: #444;
  padding: 18px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.answer-box:hover {
  background: #666;
}
</style>
