<template>
  <div class="gameplay-container">
    <!-- Top Bar: Players Info -->
    <div class="top-bar">
      <div class="player-info left">
        <UserAvatar :username="currentUser.displayName"
                    :avatarId="currentUser.avatarId"
                    class="user-avatar"
        />
        <div class="score-box">{{ currentUser.score }}</div>
      </div>

      <div class="player-info right">
        <div class="score-box">{{ opponentUser.score }}</div>
        <UserAvatar :username="opponentUser.displayName"
                    :avatarId="opponentUser.avatarId"
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
      <h2>{{ isInReadyState ? 'Ready' : currentQuestion.question }}</h2>
    </div>

    <!-- Timer Progress Bar -->
    <div v-if="!isInReadyState">

      <div class="timer-bar-wrapper mt-4">
        <div class="timer-bar" :style="{ width: timerProgress + '%' }"></div>
      </div>

      <!-- Answers Grid -->
      <div class="answers-grid mt-8">
        <GameAnswerButton
            v-for="(answer, index) in currentQuestion.answers"
            :key="index"
            class="answer-box"
            @click="selectAnswer(index)"
            :title="answer"
            :answered-users="[{avatarId:1},{avatarId:3}]"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {userStore} from "~/stores/user.store";
import {gameStore} from "~/stores/game.store";
import GameAnswerButton from "~/components/GameAnswerButton.vue";

const {$karizmaConnection} = useNuxtApp();

const GetReadyCommand = "match/get-ready";
const StartRoundCommand = "match/start-round";
const RoundResultCommand = "match/round-result";

const currentUser = ref({
  displayName: 'You',
  avatarId: 1,
  score: 0,
});

const opponentUser = ref({
  displayName: 'Opponent',
  avatarId: 2,
  score: 0,
});

const currentQuestion = ref({
  question: 'What is the capital of France?',
  answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
});

const isInReadyState = ref(false);

const timerProgress = ref(100);

let timerInterval;

const startTimer = () => {
  const gameData = gameStore();
  timerProgress.value = 100;

  clearInterval(timerInterval);

  console.warn(gameData.questionTime.value)
  timerInterval = setInterval(() => {
    if (timerProgress.value > 0) {
      timerProgress.value -= gameData.questionTime.value;
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

function subscribeServerEvents(active) {
  if (active) {
    $karizmaConnection.connection.on(GetReadyCommand, onGetReadyCommand);
    $karizmaConnection.connection.on(StartRoundCommand, onStartRoundCommand);
    $karizmaConnection.connection.on(RoundResultCommand, onRoundResultCommand);
  } else {
    $karizmaConnection.connection.off(GetReadyCommand);
    $karizmaConnection.connection.off(StartRoundCommand);
    $karizmaConnection.connection.off(RoundResultCommand);

  }
}

function onMatchStart(data) {

}

function onGetReadyCommand(data) {
  isInReadyState.value = true;

  const gameData = gameStore();
  gameData.roundNumber.value = data.RoundNumber;
  sendReady();
}

function sendReady() {
  $karizmaConnection.connection.send('game/ready');
}

function onStartRoundCommand(data) {
  isInReadyState.value = false;
  currentQuestion.value.question = data.Question.Title;
  //TODO handle category
  currentQuestion.value.answers = data.Question.Answers.map((q) => q.Title);

  const gameData = gameStore();
  gameData.roundNumber.value = data.RoundNumber;
  startTimer();
}

function onRoundResultCommand(data) {

}

function clearIntervals() {
  clearInterval(timerInterval);
}


function updateUserAvatars() {
  const userData = userStore();
  currentUser.value.displayName = userData.displayName;
  currentUser.value.avatarId = userData.avatarId;

  const gameData = gameStore();
  opponentUser.value.avatarId = gameData.opponent.avatarId;
  opponentUser.value.displayName = gameData.opponent.displayName;
}

onMounted(() => {
  updateUserAvatars();
  subscribeServerEvents(true);
  sendReady();
})

onUnmounted(() => {
  subscribeServerEvents(false);
  clearIntervals();
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
  gap: 20px;
}
</style>
