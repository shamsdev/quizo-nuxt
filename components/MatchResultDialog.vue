<template>
  <div class="match-result-dialog">
    <p v-if="oppLeft" class="opp-left-title mb-5">Opponent Left the match!</p>
    <p class="result-title">{{ resultText }}</p>
    <p class="score-text">Your Score: {{ score }}</p>
    <FancyButton class="mt-8" title="Back to Home" @click="goHome"/>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useRouter} from 'vue-router';
import FancyButton from './FancyButton.vue';
import {launchConfetti} from "~/utils/confetti.js";

const props = defineProps({
  result: {
    type: String,
    required: true,
    validator: (value) => ['Win', 'Lose', 'Draw'].includes(value),
  },
  score: {
    type: Number,
    required: true,
  },
  oppLeft: {
    type: Boolean,
    required: true,
  },
});

const router = useRouter();

const resultText = computed(() => {
  if (props.result === 'Win') {
    launchConfetti();
    return 'You Win!';
  }
  if (props.result === 'Lose') {
    return 'You Lose!';
  }
  return 'Game Draw!';
});

const goHome = () => {
  router.replace('/home');
};
</script>

<style scoped>
.match-result-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 16px;
}

.opp-left-title {
  font-size: 1.5rem;
}

.result-title {
  font-size: 2.5rem;
  font-weight: bold;
}

.score-text {
  font-size: 1.5rem;
}
</style>
