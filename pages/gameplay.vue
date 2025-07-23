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
        <h2>Question {{roundStatus.currentRound}}/{{roundStatus.maxRounds}}</h2>
      </div>
    </div>

    <!-- Question Box -->
    <div class="question-box mt-2">
      <h4 v-if="!isInReadyState">{{ currentQuestion.Category }}</h4>
      <h2 class="flex-grow-1 align-center align-content-center">{{
          isInReadyState ? 'Ready' : currentQuestion.Title
        }}</h2>
    </div>

    <!-- Timer Progress Bar -->
    <div v-if="!isInReadyState">

      <div class="timer-bar-wrapper mt-4">
        <div class="timer-bar" :style="{ width: timerProgress + '%' }"></div>
      </div>

      <!-- Answers Grid -->
      <div class="answers-grid mt-8">
        <GameAnswerButton
            v-for="(answer, index) in currentQuestion.Answers"
            :key="index"
            class="answer-box"
            :disabled="!canAnswer"
            :selected="answer.Id === currentSelectedAnswerId"
            :red="correctAnswerId != null && answer.Id === currentSelectedAnswerId && answer.Id !== correctAnswerId"
            :green="answer.Id === correctAnswerId"
            @click="selectAnswer(index)"
            :title="answer.Title"
            :answered-users="answer.selectUsers?.map(userId => {
              return {
                avatarId: userId === currentUser.userId ? currentUser.avatarId : opponentUser.avatarId
              }})"
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
  userId: 1,
  displayName: 'You',
  avatarId: 1,
  score: 0,
});

const opponentUser = ref({
  userId: 2,
  displayName: 'Opponent',
  avatarId: 2,
  score: 0,
});

const roundStatus = ref({
  currentRound: 1,
  maxRounds: 2
});


const currentQuestion = ref({
  Category: 'Geography',
  Title: 'What is the capital of France?',
  Answers: [
    {Id: 1, Title: 'Berlin', selectUsers: [1, 3]},
    {Id: 2, Title: 'Madrid', selectUsers: [1, 3]},
    {Id: 3, Title: 'Paris', selectUsers: [1, 3]},
    {Id: 4, Title: 'Rome', selectUsers: [1, 3]}],
});

const isInReadyState = ref(true);
const canAnswer = ref(true);
const currentSelectedAnswerId = ref(null);
const correctAnswerId = ref(null);

const timerProgress = ref(100);

let timerInterval;

const startTimer = () => {
  const gameData = gameStore();
  timerProgress.value = 100;

  clearInterval(timerInterval);

  const questionTime = gameData.questionTime.value - 500;
  let timeLeft = questionTime;
  timerInterval = setInterval(() => {
    if (timerProgress.value > 0) {
      timerProgress.value = timeLeft / questionTime * 100.0;
      timeLeft -= 100;
    } else {
      clearInterval(timerInterval)
      // Handle timeout
    }
  }, 100)
}

const selectAnswer = (index) => {
  canAnswer.value = false;
  const selectedAnswer = currentQuestion.value.Answers[index];
  currentSelectedAnswerId.value = selectedAnswer.Id;
  console.log('Answer selected:', selectedAnswer.Id)
  sendAnswer(selectedAnswer.Id);
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

function onGetReadyCommand(data) {
  isInReadyState.value = true;

  roundStatus.value.currentRound = data.RoundNumber;
  sendReady();
}

function sendReady() {
  $karizmaConnection.connection.send('game/ready');
}

function sendAnswer(answerId) {
  $karizmaConnection.connection.send('game/answer', answerId);
}

function onStartRoundCommand(data) {
  canAnswer.value = true;
  isInReadyState.value = false;
  currentSelectedAnswerId.value = null;
  correctAnswerId.value = null;

  currentQuestion.value = data.Question;
  startTimer();
}

function onRoundResultCommand(data) {
  clearInterval(timerInterval);
  canAnswer.value = false;

  correctAnswerId.value = data.CorrectAnswerId;


  //Show user answers
  for (const userData of data.UsersData) {
    if (userData.UserId === currentUser.value.userId)
      currentUser.value.score = userData.Score;
    else
      opponentUser.value.score = userData.Score;

    for (const answer of currentQuestion.value.Answers) {

      if (!answer.selectUsers)
        answer.selectUsers = [];

      if (answer.Id === userData.AnswerId)
        answer.selectUsers.push(userData.UserId);

    }
  }
}

function clearIntervals() {
  clearInterval(timerInterval);
}


function updateUserAvatars() {
  const userData = userStore();
  currentUser.value.userId = userData.userId;
  currentUser.value.displayName = userData.displayName;
  currentUser.value.avatarId = userData.avatarId;

  const gameData = gameStore();
  opponentUser.value.userId = gameData.userId;
  opponentUser.value.avatarId = gameData.opponent.avatarId;
  opponentUser.value.displayName = gameData.opponent.displayName;
}

function initRoundStatus() {
  const gameData = gameStore();
  roundStatus.value.maxRounds = gameData.maxRounds;
}

onMounted(() => {
  updateUserAvatars();
  initRoundStatus();
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
