<template>
  <div class="gameplay-container">
    <!-- Top Bar: Players Info -->
    <div class="top-bar">
      <div class="player-info left">
        <UserAvatar
            :user-id="currentUser.userId"
            :username="currentUser.displayName"
            :avatar-id="currentUser.avatarId"
            class="user-avatar"
            loading-strategy="eager"
        />
        <div class="score-box">{{ currentUser.score }}</div>
      </div>
      <div class="player-info right">
        <div class="score-box">{{ opponentUser.score }}</div>
        <UserAvatar
            :user-id="opponentUser.userId"
            :username="opponentUser.displayName"
            :avatar-id="opponentUser.avatarId"
            class="user-avatar"
            loading-strategy="eager"
        />
      </div>
    </div>

    <!-- Round Info -->
    <div class="question-count-box-bg mt-4">
      <div class="question-count-box">
        <h2>سوال {{ roundStatus.currentRound }} از {{ roundStatus.maxRounds }}</h2>
      </div>
    </div>

    <!-- Question Display -->
    <div class="question-box mt-2">
      <h5 v-if="!isInReadyState">{{ currentQuestion.Category }}</h5>
      <h2 class="question-title">{{ isInReadyState ? 'آماده باش!' : currentQuestion.Title }}</h2>
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

    <!-- Dialogs -->
    <BaseDialog ref="matchResultDialog" :close-on-background="false">
      <MatchResultDialog :result="matchResult.MatchStateStr" :score="matchResult.Score"
                         :oppLeft="matchResult.OpponentLeft"/>
    </BaseDialog>

  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
import {userStore} from '~/stores/user.store';
import {gameStore} from '~/stores/game.store';
import GameAnswerButton from '~/components/GameAnswerButton.vue';

const {$karizmaConnection} = useNuxtApp();

const matchResultDialog = ref();

// Commands
const GetReadyCommand = 'match/get-ready';
const StartRoundCommand = 'match/start-round';
const RoundResultCommand = 'match/round-result';
const MatchResultCommand = "match/result";

// State
const currentUser = ref({userId: 0, displayName: '', avatarId: 0, score: 0});
const opponentUser = ref({userId: 0, displayName: '', avatarId: 0, score: 0});

const roundStatus = ref({currentRound: 1, maxRounds: 1});
const currentQuestion = ref({Category: 'سینما', Title: 'سوال', Answers: [''] as any[]});
const isInReadyState = ref(true);
const canAnswer = ref(true);
const currentSelectedAnswerId = ref<number | null>(null);
const correctAnswerId = ref<number | null>(null);
const timerProgress = ref(100);

const matchResult = ref({MatchStateStr: 'Win', Score: 0, OpponentLeft: false});

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
    conn.on(MatchResultCommand, onMatchResult);

  } else {
    conn.off(GetReadyCommand);
    conn.off(StartRoundCommand);
    conn.off(RoundResultCommand);
    conn.off(MatchResultCommand);
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

function onMatchResult(data: any): void {
  matchResult.value = data;
  matchResultDialog.value.show();
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
    userId,
    avatarId: userId === currentUser.value.userId
        ? currentUser.value.avatarId
        : opponentUser.value.avatarId,
  }));
}
</script>

<style scoped>
.gameplay-container {
  direction: rtl;
  width: 100%;
  max-width: 800px;
  padding: var(--space-4);
  margin: 0 auto;
  color: var(--text-primary);
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.player-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
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
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-3);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-lg);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  min-width: 48px;
  text-align: center;
}

.question-count-box-bg {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-2);
}

.question-count-box {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
  background: var(--bg-card);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  width: fit-content;
  border: 1px solid var(--border-subtle);
}

.question-count-box h2 {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

.question-box {
  width: 100%;
  min-width: 100%;
  box-sizing: border-box;
  text-align: center;
  font-size: var(--text-base);
  background: var(--bg-card);
  padding: var(--game-card-padding);
  border-radius: var(--radius-lg);
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--border-default);
  gap: var(--space-4);
}

.question-box h5 {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
}

.question-title {
  color: var(--text-primary);
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
}

.timer-bar-wrapper {
  direction: ltr;
  width: 100%;
  height: 12px;
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-4);
  border: 1px solid var(--border-subtle);
}

.timer-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-success), var(--color-primary));
  border-radius: var(--radius-full);
  transition: width 0.1s linear;
}

.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
</style>
