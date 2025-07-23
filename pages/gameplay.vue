<template>
  <div class="gameplay-container">
    <!-- Top Bar: Players Info -->
    <div class="top-bar">
      <div class="player-info left">
        <UserAvatar
            :username="currentUser.displayName"
            :avatar-id="currentUser.avatarId"
            class="user-avatar"
        />
        <div class="score-box">{{ currentUser.score }}</div>
      </div>
      <div class="player-info right">
        <div class="score-box">{{ opponentUser.score }}</div>
        <UserAvatar
            :username="opponentUser.displayName"
            :avatar-id="opponentUser.avatarId"
            class="user-avatar"
        />
      </div>
    </div>

    <!-- Round Info -->
    <div class="question-count-box-bg mt-4">
      <div class="question-count-box">
        <h2>Question {{ roundStatus.currentRound }}/{{ roundStatus.maxRounds }}</h2>
      </div>
    </div>

    <!-- Question Display -->
    <div class="question-box mt-2">
      <h4 v-if="!isInReadyState">{{ currentQuestion.Category }}</h4>
      <h2>{{ isInReadyState ? 'Ready' : currentQuestion.Title }}</h2>
    </div>

    <!-- Timer & Answers -->
    <div v-if="!isInReadyState">
      <div class="timer-bar-wrapper mt-4">
        <div class="timer-bar" :style="{ width: timerProgress + '%' }"></div>
      </div>

      <div class="answers-grid mt-8">
        <GameAnswerButton
            v-for="(answer, index) in currentQuestion.Answers"
            :key="index"
            class="answer-box"
            :title="answer.Title"
            :disabled="!canAnswer"
            :selected="answer.Id === currentSelectedAnswerId"
            :green="answer.Id === correctAnswerId"
            :red="correctAnswerId !== null && currentSelectedAnswerId === answer.Id && answer.Id !== correctAnswerId"
            :answered-users="getAnswerAvatars(answer.selectUsers)"
            @click="selectAnswer(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { userStore } from '~/stores/user.store';
import { gameStore } from '~/stores/game.store';
import GameAnswerButton from '~/components/GameAnswerButton.vue';

const { $karizmaConnection } = useNuxtApp();

// Commands
const GetReadyCommand = 'match/get-ready';
const StartRoundCommand = 'match/start-round';
const RoundResultCommand = 'match/round-result';

// State
const currentUser = ref({ userId: 0, displayName: '', avatarId: 0, score: 0 });
const opponentUser = ref({ userId: 0, displayName: '', avatarId: 0, score: 0 });

const roundStatus = ref({ currentRound: 1, maxRounds: 1 });
const currentQuestion = ref({ Category: '', Title: '', Answers: [] as any[] });
const isInReadyState = ref(true);
const canAnswer = ref(true);
const currentSelectedAnswerId = ref<number | null>(null);
const correctAnswerId = ref<number | null>(null);
const timerProgress = ref(100);

let timerInterval: number;

// Lifecycle
onMounted(() => {
  initUserData();
  initGameConfig();
  subscribeToEvents(true);
  sendReady();
});

onUnmounted(() => {
  clearInterval(timerInterval);
  subscribeToEvents(false);
});

// Event Subscription
function subscribeToEvents(active: boolean): void {
  const conn = $karizmaConnection.connection;
  if (active) {
    conn.on(GetReadyCommand, onGetReady);
    conn.on(StartRoundCommand, onStartRound);
    conn.on(RoundResultCommand, onRoundResult);
  } else {
    conn.off(GetReadyCommand);
    conn.off(StartRoundCommand);
    conn.off(RoundResultCommand);
  }
}

// Init
function initUserData(): void {
  const user = userStore();
  const game = gameStore();
  currentUser.value = {
    userId: user.userId,
    displayName: user.displayName,
    avatarId: user.avatarId,
    score: 0,
  };
  opponentUser.value = {
    userId: game.userId,
    displayName: game.opponent.displayName,
    avatarId: game.opponent.avatarId,
    score: 0,
  };
}

function initGameConfig(): void {
  roundStatus.value.maxRounds = gameStore().maxRounds;
}

// Timer
function startTimer(): void {
  const game = gameStore();
  const duration = game.questionTime.value - 500;
  let timeLeft = duration;

  clearInterval(timerInterval);
  timerProgress.value = 100;

  timerInterval = setInterval(() => {
    timeLeft -= 100;
    timerProgress.value = Math.max(0, (timeLeft / duration) * 100);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
    }
  }, 100);
}

// UI Actions
function selectAnswer(index: number): void {
  if (!canAnswer.value) return;
  canAnswer.value = false;

  const selected = currentQuestion.value.Answers[index];
  currentSelectedAnswerId.value = selected.Id;
  sendAnswer(selected.Id);
}

// WebSocket Handlers
function onGetReady(data: any): void {
  isInReadyState.value = true;
  roundStatus.value.currentRound = data.RoundNumber;
  sendReady();
}

function onStartRound(data: any): void {
  isInReadyState.value = false;
  canAnswer.value = true;
  currentSelectedAnswerId.value = null;
  correctAnswerId.value = null;
  currentQuestion.value = data.Question;
  startTimer();
}

function onRoundResult(data: any): void {
  clearInterval(timerInterval);
  canAnswer.value = false;
  correctAnswerId.value = data.CorrectAnswerId;

  for (const user of data.UsersData) {
    const target = user.UserId === currentUser.value.userId ? currentUser : opponentUser;
    target.value.score = user.Score;

    for (const answer of currentQuestion.value.Answers) {
      answer.selectUsers ??= [];
      if (answer.Id === user.AnswerId) {
        answer.selectUsers.push(user.UserId);
      }
    }
  }
}

// Server Senders
function sendReady(): void {
  $karizmaConnection.connection.send('game/ready');
}

function sendAnswer(answerId: number): void {
  $karizmaConnection.connection.send('game/answer', answerId);
}

// Helpers
function getAnswerAvatars(userIds: number[] = []): { avatarId: number }[] {
  return userIds.map((userId) => ({
    avatarId: userId === currentUser.value.userId
        ? currentUser.value.avatarId
        : opponentUser.value.avatarId,
  }));
}
</script>

<style scoped>
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

.user-avatar {
  scale: 0.9;
  width: 94px;
  height: auto;
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
  flex-direction: column;
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
  gap: 20px;
}
</style>
