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
        <div class="score-box" :class="{ 'score-box--pop': scorePop }">{{ currentUser.score }}</div>
      </div>
      <div class="player-info right">
        <div class="score-box" :class="{ 'score-box--pop': opponentScorePop }">{{ opponentUser.score }}</div>
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

    <!-- Ready state vs Round (question + timer + answers) - single transition to avoid glitch -->
    <Transition name="round-state" mode="out-in">
      <div v-if="isInReadyState" key="ready" class="state-block state-block--ready">
        <div class="question-box question-box--ready mt-2">
          <span class="ready-text">آماده باش!</span>
          <span class="ready-dots" aria-hidden="true">...</span>
        </div>
      </div>
      <div v-else key="round" class="state-block state-block--round">
        <div class="question-box question-box--reveal mt-2">
          <div class="question-content">
            <h5 class="question-category">{{ currentQuestion.Category }}</h5>
            <h2 class="question-title">{{ currentQuestion.Title }}</h2>
          </div>
        </div>
        <div class="timer-bar-wrapper mt-4" :class="{ 'timer-bar-wrapper--urgent': timerProgress < 25 }">
          <div class="timer-bar" :style="{ width: timerProgress + '%' }"></div>
        </div>
        <div class="answers-grid mt-8">
          <GameAnswerButton
              v-for="(answer, index) in currentQuestion.Answers"
              :key="answer.Id"
              class="answer-box"
              :answer-index="index"
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
    </Transition>

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
const sounds = useGameSounds();

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
const scorePop = ref(false);
const opponentScorePop = ref(false);

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
  let lastUrgentTickHalfSec = -1;

  clearInterval(timerInterval);
  timerProgress.value = 100;

  timerInterval = setInterval(() => {
    timeLeft -= 100;
    timerProgress.value = Math.max(0, (timeLeft / duration) * 100);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      sounds.playTimeUp();
      return;
    }
    // Tick-tock when bar is red (urgent): alternating tick/tock every 0.5s
    if (timerProgress.value < 25) {
      const halfSec = Math.ceil(timeLeft / 500);
      if (halfSec !== lastUrgentTickHalfSec && halfSec > 0) {
        lastUrgentTickHalfSec = halfSec;
        sounds.playTick(halfSec % 2 === 1);
      }
    }
  }, 100);
}

// UI Actions
function selectAnswer(index: number): void {
  if (!canAnswer.value) return;
  canAnswer.value = false;
  sounds.playClick();

  const selected = currentQuestion.value.Answers[index];
  currentSelectedAnswerId.value = selected.Id;
  sendAnswer(selected.Id);
}

// WebSocket Handlers
function onGetReady(data: any): void {
  isInReadyState.value = true;
  roundStatus.value.currentRound = data.RoundNumber;
  sounds.playReady();
  sendReady();
}

function onStartRound(data: any): void {
  isInReadyState.value = false;
  canAnswer.value = true;
  currentSelectedAnswerId.value = null;
  correctAnswerId.value = null;
  currentQuestion.value = data.Question;
  sounds.playQuestion();
  startTimer();
}

function onRoundResult(data: any): void {
  clearInterval(timerInterval);
  canAnswer.value = false;
  correctAnswerId.value = data.CorrectAnswerId;

  const myAnswerId = currentSelectedAnswerId.value;
  const correctId = data.CorrectAnswerId;
  if (myAnswerId === correctId) {
    sounds.playCorrect();
    launchConfetti();
  } else {
    sounds.playWrong();
  }

  for (const user of data.UsersData) {
    const target = user.UserId === currentUser.value.userId ? currentUser : opponentUser;
    const prevScore = target.value.score;
    target.value.score = user.Score;
    if (target.value.score !== prevScore) {
      if (user.UserId === currentUser.value.userId) {
        scorePop.value = true;
        setTimeout(() => { scorePop.value = false; }, 400);
      } else {
        opponentScorePop.value = true;
        setTimeout(() => { opponentScorePop.value = false; }, 400);
      }
    }

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
  if (data.MatchStateStr === 'Win') {
    sounds.playWin();
  } else if (data.MatchStateStr === 'Lose') {
    sounds.playLose();
  } else {
    sounds.playDraw();
  }
  matchResultDialog.value.show();
}

// Server Senders
function sendReady(): void {
  $karizmaConnection.connection.send('game/ready');
}

function sendAnswer(answerId: number): void {
  $karizmaConnection.connection.send('game/answer', answerId);
}

// Confetti on correct
function launchConfetti(): void {
  if (import.meta.client) {
    import('~/utils/confetti').then(({ launchConfetti: launch }) => launch());
  }
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
  transition: transform var(--duration-normal) var(--ease-out-back);
}

.score-box--pop {
  animation: score-pop 0.4s var(--ease-out-back);
}

@keyframes score-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
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
  transition: box-shadow var(--duration-normal) ease;
}

/* Ready state: juicier animations */
.question-box--ready {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary), 0 0 24px rgba(14, 165, 233, 0.2);
  animation: ready-box-glow 2s var(--ease-out-strong) infinite;
}

.question-box--ready .ready-text {
  display: inline-block;
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  animation: ready-text-pop 0.5s var(--ease-out-back) forwards, ready-text-breathe 1.5s var(--ease-out-strong) 0.5s infinite;
  text-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
}

.question-box--ready .ready-dots {
  display: inline-block;
  margin-right: 2px;
  animation: ready-dots 1.2s ease-in-out infinite;
  opacity: 0.9;
}

@keyframes ready-box-glow {
  0%, 100% { box-shadow: 0 0 0 2px var(--color-primary), 0 0 24px rgba(14, 165, 233, 0.2); }
  50% { box-shadow: 0 0 0 2px var(--color-primary), 0 0 32px rgba(14, 165, 233, 0.35); }
}

@keyframes ready-text-pop {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes ready-text-breathe {
  0%, 100% { transform: scale(1); text-shadow: 0 0 20px rgba(14, 165, 233, 0.5); }
  50% { transform: scale(1.04); text-shadow: 0 0 28px rgba(14, 165, 233, 0.7); }
}

@keyframes ready-dots {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.question-box--reveal {
  box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4);
  animation: question-reveal-glow 0.6s var(--ease-out-strong) forwards;
}

.question-content {
  animation: question-in 0.4s var(--ease-out-back) forwards;
}

.question-category {
  margin: 0 0 var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
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

@keyframes question-reveal-glow {
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.5); }
  100% { box-shadow: 0 0 24px 2px rgba(14, 165, 233, 0.15); }
}

@keyframes question-in {
  0% { opacity: 0; transform: scale(0.95) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* Single transition: ready ⇄ round (question + timer + answers) - no glitch */
.state-block {
  width: 100%;
}

.round-state-leave-active {
  transition: opacity 0.2s ease, transform 0.25s var(--ease-out-strong);
}

.round-state-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.round-state-enter-active {
  transition: opacity 0.3s ease 0.05s, transform 0.35s var(--ease-out-back) 0.05s;
}

.round-state-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

/* When entering round state, question content animates in after block enters */
.state-block--round .question-content {
  opacity: 0;
  animation: question-in 0.4s var(--ease-out-back) 0.15s forwards;
}

.timer-bar-wrapper {
  direction: ltr;
  width: 100%;
  height: 14px;
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-4);
  border: 1px solid var(--border-subtle);
  transition: box-shadow var(--duration-normal) ease, border-color var(--duration-normal) ease;
}

.timer-bar-wrapper--urgent {
  border-color: var(--color-error);
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.35);
  animation: timer-urgent-pulse 0.8s ease infinite;
}

@keyframes timer-urgent-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(239, 68, 68, 0.35); }
  50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
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

.answers-grid :deep(.answer-box) {
  animation: answer-in 0.4s var(--ease-out-back) backwards;
}

.answers-grid :deep(.answer-box:nth-child(1)) { animation-delay: 0.05s; }
.answers-grid :deep(.answer-box:nth-child(2)) { animation-delay: 0.1s; }
.answers-grid :deep(.answer-box:nth-child(3)) { animation-delay: 0.15s; }
.answers-grid :deep(.answer-box:nth-child(4)) { animation-delay: 0.2s; }

@keyframes answer-in {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(16px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
